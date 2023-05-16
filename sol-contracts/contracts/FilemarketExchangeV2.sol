// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./IEncryptedFileToken.sol";
import "./IEncryptedFileTokenCallbackReceiver.sol";

contract FilemarketExchangeV2 is IEncryptedFileTokenCallbackReceiver, Context, Ownable {
    using ECDSA for bytes32;
    using SafeERC20 for IERC20;

    struct Order {
        IEncryptedFileToken token;
        uint256 tokenId;
        uint256 price;
        IERC20 currency;
        address payable initiator;
        address payable receiver;
        bool fulfilled;
    }

    uint256 public constant PERCENT_MULTIPLIER = 10000;

    uint256 public fee;               // fee as percentage * PERCENT_MULTIPLIER / 100
    uint256 public accumulatedFees;

    IERC20[] public tokensReceived; // array to track what ERC20 tokens we received
    mapping(IERC20 => uint256) public accumulatedFeesERC20;

    mapping(IEncryptedFileToken => uint256) public whitelistDeadlines;
    mapping(IEncryptedFileToken => uint256) public whitelistDiscounts;  // 1 - 0.01%

    mapping(IEncryptedFileToken => mapping(uint256 => Order)) public orders;

    event FeeChanged(uint256 newFee);

    constructor(uint256 _fee) {
        require(_fee <= PERCENT_MULTIPLIER, "FilemarketExchangeV2: fee cannot be more than 100%");
        fee = _fee;
    }

    function setFee(uint256 _fee) external onlyOwner {
        require(_fee <= PERCENT_MULTIPLIER, "FilemarketExchangeV2: fee cannot be more than 100%");
        fee = _fee;
        emit FeeChanged(_fee);
    }

    function setWhitelistParams(
        IEncryptedFileToken collection,
        uint256 deadline,
        uint256 discount
    ) external onlyOwner {
        whitelistDeadlines[collection] = deadline;
        whitelistDiscounts[collection] = discount;
    }

    function placeOrder(
        IEncryptedFileToken token,
        uint256 tokenId,
        uint256 price,
        IERC20 currency
    ) external {
        require(price > 0, "FilemarketExchangeV2: price must be positive");
        require(token.supportsInterface(type(IEncryptedFileToken).interfaceId));
        require(orders[token][tokenId].price == 0, "FilemarketExchangeV2: order exists");
        orders[token][tokenId] = Order(token, tokenId, price, currency, payable(_msgSender()), payable(0), false);
        token.draftTransfer(tokenId, IEncryptedFileTokenCallbackReceiver(this));
    }

    function placeOrderBatch(
        IEncryptedFileToken token,
        uint256[] calldata tokenIds,
        uint256 price,
        IERC20 currency
    ) external {
        require(price > 0, "FilemarketExchangeV2: price must be positive");
        require(token.supportsInterface(type(IEncryptedFileToken).interfaceId));
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(orders[token][tokenIds[i]].price == 0, "FilemarketExchangeV2: order exists");
            orders[token][tokenIds[i]] = Order(token, tokenIds[i], price, currency, payable(_msgSender()), payable(0), false);
            token.draftTransfer(tokenIds[i], IEncryptedFileTokenCallbackReceiver(this));
        }
    }

    function fulfillOrder(
        IEncryptedFileToken token,
        bytes calldata publicKey,
        uint256 tokenId
    ) external payable {
        Order storage order = orders[token][tokenId];
        require(order.price != 0, "FilemarketExchangeV2: order doesn't exist");
        require(!order.fulfilled, "FilemarketExchangeV2: order was already fulfilled");
        require(whitelistDeadlines[token] == 0 || whitelistDeadlines[token] < block.timestamp, "FilemarketExchangeV2: whitelist period");
        
        if (order.currency != IERC20(address(0))) {
            require(order.currency.allowance(_msgSender(), address(this)) >= order.price, "FilemarketExchangeV2: allowance must be >= price");
            order.currency.safeTransferFrom(_msgSender(), address(this), order.price);
        } else {
            require(msg.value == order.price, "FilemarketExchangeV2: value must equal");
        }
        order.receiver = payable(_msgSender());
        order.fulfilled = true;
        order.token.completeTransferDraft(order.tokenId, order.receiver, publicKey, bytes(""));
    }

    function fulfillOrderWhitelisted(
        IEncryptedFileToken token,
        bytes calldata publicKey,
        uint256 tokenId,
        bytes calldata signature
    ) external payable {
        Order storage order = orders[token][tokenId];
        require(order.price != 0, "FilemarketExchangeV2: order doesn't exist");
        require(!order.fulfilled, "FilemarketExchangeV2: order was already fulfilled");
        require(whitelistDeadlines[token] != 0, "FilemarketExchangeV2: collection doesn't have whitelist");
        require(whitelistDeadlines[token] > block.timestamp, "FilemarketExchangeV2: whitelist deadline exceeds");
        bytes32 address_bytes = bytes32(uint256(uint160(_msgSender())));
        require(address_bytes.toEthSignedMessageHash().recover(signature) == owner(), "FilemarketExchangeV2: whitelist invalid signature");
        uint256 discount = (order.price*whitelistDiscounts[token])/PERCENT_MULTIPLIER;
        uint256 discount_price = order.price - discount;

        if (order.currency != IERC20(address(0))) {
            require(order.currency.allowance(_msgSender(), address(this)) >= discount_price, "FilemarketExchangeV2: allowance must be >= price with discount");
            order.currency.safeTransferFrom(_msgSender(), address(this), discount_price);
        } else {
            require(msg.value == discount_price, "FilemarketExchangeV2: value must equal price with discount");
        }
        order.receiver = payable(_msgSender());
        order.fulfilled = true;
        order.token.completeTransferDraft(order.tokenId, order.receiver, publicKey, bytes(""));
    }

    function cancelOrder(
        IEncryptedFileToken token,
        uint256 tokenId
    ) external {
        Order storage order = orders[token][tokenId];
        require(order.price != 0, "FilemarketExchangeV2: order doesn't exist");
        require(!order.fulfilled, "FilemarketExchangeV2: order was fulfilled");
        order.token.cancelTransfer(tokenId);
    }

    function transferCancelled(uint256 tokenId) external {
        Order storage order = orders[IEncryptedFileToken(_msgSender())][tokenId];
        require(order.price != 0, "FilemarketExchangeV2: order doesn't exist");
        if (order.fulfilled) {
            safeTransferCurrency(order.currency, order.receiver, order.price);
        }
        delete orders[IEncryptedFileToken(_msgSender())][tokenId];
    }

    function transferFinished(uint256 tokenId) external {
        Order storage order = orders[IEncryptedFileToken(_msgSender())][tokenId];
        require(order.price != 0, "FilemarketExchangeV2: order doesn't exist");
        require(order.fulfilled, "FilemarketExchangeV2: order wasn't fulfilled");
        
        uint256 feeAmount = (order.price * fee) / PERCENT_MULTIPLIER;
        uint256 receiverAmount = order.price - feeAmount;

        if (order.currency != IERC20(address(0))) {
            if (accumulatedFeesERC20[order.currency] == 0) {
                tokensReceived.push(order.currency);
            }
            accumulatedFeesERC20[order.currency] += feeAmount;
        } else {
            accumulatedFees += feeAmount;
        }
        
        try IERC2981(_msgSender()).royaltyInfo(tokenId, order.price) returns (address receiver, uint royaltyAmount) {
            if (receiver != address(0) && royaltyAmount > 0) {
                receiverAmount -= royaltyAmount;
                safeTransferCurrency(order.currency, payable(receiver), royaltyAmount);
            }
        } catch {}
            
        safeTransferCurrency(order.currency, order.initiator, receiverAmount);
        delete orders[IEncryptedFileToken(_msgSender())][tokenId];
    }

    function transferFraudDetected(uint256 tokenId, bool approved) external {
        Order storage order = orders[IEncryptedFileToken(_msgSender())][tokenId];
        require(order.price != 0, "FilemarketExchangeV2: order doesn't exist");
        require(order.fulfilled, "FilemarketExchangeV2: order wasn't fulfilled");
        if (approved) {
            safeTransferCurrency(order.currency, order.receiver, order.price);
        } else {
            safeTransferCurrency(order.currency, order.initiator, order.price);
        }
        delete orders[IEncryptedFileToken(_msgSender())][tokenId];
    }

    function safeTransferCurrency(IERC20 currency, address payable to, uint256 amount) internal {
        if (currency != IERC20(address(0))) {
            currency.safeTransfer(to, amount);
        } else {
            to.transfer(amount);
        }
    }

    function withdrawFees(address payable to) external onlyOwner {
        require(accumulatedFees > 0 || tokensReceived.length > 0, "FilemarketExchangeV2: No fees to withdraw");
        if (accumulatedFees > 0) {
            uint256 amount = accumulatedFees;
            accumulatedFees = 0;

            to.transfer(amount);
        }

        if (tokensReceived.length > 0) {
            for (uint i = 0; i < tokensReceived.length; i++) {
                IERC20 token = tokensReceived[i];
                token.safeTransfer(to, accumulatedFeesERC20[token]);
            }
        }
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

import "./IEncryptedFileToken.sol";
import "./IEncryptedFileTokenCallbackReceiver.sol";

contract FilemarketExchangeV2 is IEncryptedFileTokenCallbackReceiver, Context, Ownable {
    using ECDSA for bytes32;

    struct Order {
        IEncryptedFileToken token;
        uint256 tokenId;
        uint256 price;
        address payable initiator;
        address payable receiver;
        bool fulfilled;
    }

    uint256 public constant PERCENT_MULTIPLIER = 10000;

    uint256 public feePointPrecision;
    uint256 public fee;               // fee as (percentage * 10^feePointPrecision). Ex: (precision: 2, value: 1337) => 13.37%
    uint256 public accumulatedFees;

    mapping(IEncryptedFileToken => uint256) public whitelistDeadlines;
    mapping(IEncryptedFileToken => uint256) public whitelistDiscounts;  // 1 - 0.01%

    mapping(IEncryptedFileToken => mapping(uint256 => Order)) public orders;

    event FeeChanged(uint256 newFee, uint256 newFeePointPrecision);

    constructor(uint256 _fee, uint256 _feePointPrecision) {
        require(_feePointPrecision > 0, "FilemarketExchangeV2: fee decimal point precision cannot be less then 0");
        require(_fee <= 100 * 10**feePointPrecision, "FilemarketExchangeV2: fee cannot be more than 100%");
        fee = _fee;
        feePointPrecision = _feePointPrecision;
    }

    function setFee(uint256 _fee, uint256 _feePointPrecision) external onlyOwner {
        require(_feePointPrecision > 0, "FilemarketExchangeV2: fee decimal point precision cannot be less then 0");
        require(_fee <= 100 * 10**feePointPrecision, "FilemarketExchangeV2: fee cannot be more than 100%");
        fee = _fee;
        feePointPrecision = _feePointPrecision;
        emit FeeChanged(_fee, _feePointPrecision);
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
        uint256 price
    ) external {
        require(price > 0, "FilemarketExchangeV2: price must be positive");
        require(token.supportsInterface(type(IEncryptedFileToken).interfaceId));
        require(orders[token][tokenId].price == 0, "FilemarketExchangeV2: order exists");
        orders[token][tokenId] = Order(token, tokenId, price, payable(_msgSender()), payable(0), false);
        token.draftTransfer(tokenId, IEncryptedFileTokenCallbackReceiver(this));
    }

    function placeOrderBatch(
        IEncryptedFileToken token,
        uint256[] calldata tokenIds,
        uint256 price
    ) external {
        require(price > 0, "FilemarketExchangeV2: price must be positive");
        require(token.supportsInterface(type(IEncryptedFileToken).interfaceId));
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(orders[token][tokenIds[i]].price == 0, "FilemarketExchangeV2: order exists");
            orders[token][tokenIds[i]] = Order(token, tokenIds[i], price, payable(_msgSender()), payable(0), false);
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
        require(msg.value == order.price, "FilemarketExchangeV2: value must equal");
        require(whitelistDeadlines[token] == 0 || whitelistDeadlines[token] < block.timestamp, "FilemarketExchangeV2: whitelist period");
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
        require(msg.value == discount_price, "FilemarketExchangeV2: value must equal price with discount");
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
            order.receiver.transfer(order.price);
        }
        delete orders[IEncryptedFileToken(_msgSender())][tokenId];
    }

    function transferFinished(uint256 tokenId) external {
        Order storage order = orders[IEncryptedFileToken(_msgSender())][tokenId];
        require(order.price != 0, "FilemarketExchangeV2: order doesn't exist");
        require(order.fulfilled, "FilemarketExchangeV2: order wasn't fulfilled");
        
        uint256 feeAmount = order.price * fee / 10**feePointPrecision;
        uint256 receiverAmount = order.price - feeAmount;
        accumulatedFees += feeAmount;
        
        try IERC2981(_msgSender()).royaltyInfo(tokenId, order.price) returns (address receiver, uint royaltyAmount) {
            if (receiver != address(0) && royaltyAmount > 0) {
                receiverAmount -= royaltyAmount;
                payable(receiver).transfer(royaltyAmount);
            }
        } catch {}

        order.initiator.transfer(receiverAmount);

        delete orders[IEncryptedFileToken(_msgSender())][tokenId];
    }

    function transferFraudDetected(uint256 tokenId, bool approved) external {
        Order storage order = orders[IEncryptedFileToken(_msgSender())][tokenId];
        require(order.price != 0, "FilemarketExchangeV2: order doesn't exist");
        require(order.fulfilled, "FilemarketExchangeV2: order wasn't fulfilled");
        if (approved) {
            order.receiver.transfer(order.price);
        } else {
            order.initiator.transfer(order.price);
        }
        delete orders[IEncryptedFileToken(_msgSender())][tokenId];
    }

    function withdrawFees() external onlyOwner {
        require(accumulatedFees > 0, "FilemarketExchangeV2: No fees to withdraw");

        uint256 amount = accumulatedFees;
        accumulatedFees = 0;
        payable(owner()).transfer(amount);
    }
}
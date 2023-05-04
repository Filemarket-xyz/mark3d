// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IEncryptedFileToken.sol";
import "./IEncryptedFileTokenCallbackReceiver.sol";

contract Mark3dExchange is IEncryptedFileTokenCallbackReceiver, Context, Ownable {
    using ECDSA for bytes32;

    struct Order {
        IEncryptedFileToken token;
        uint256 tokenId;
        uint256 price;
        address payable initiator;
        address payable receiver;
        bool fulfilled;
    }

    constructor() {
    }

    uint256 public constant PERCENT_MULTIPLIER = 10000;

    mapping(IEncryptedFileToken => uint256) public whitelistDeadlines;
    mapping(IEncryptedFileToken => uint256) public whitelistDiscounts;  // 1 - 0.01%

    mapping(IEncryptedFileToken => mapping(uint256 => Order)) public orders;

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
        require(price > 0, "Mark3dExchange: price must be positive");
        require(token.supportsInterface(type(IEncryptedFileToken).interfaceId));
        require(orders[token][tokenId].price == 0, "Mark3dExchange: order exists");
        orders[token][tokenId] = Order(token, tokenId, price, payable(_msgSender()), payable(0), false);
        token.draftTransfer(tokenId, IEncryptedFileTokenCallbackReceiver(this));
    }

    function placeOrderBatch(
        IEncryptedFileToken token,
        uint256[] calldata tokenIds,
        uint256 price
    ) external {
        require(price > 0, "Mark3dExchange: price must be positive");
        require(token.supportsInterface(type(IEncryptedFileToken).interfaceId));
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(orders[token][tokenIds[i]].price == 0, "Mark3dExchange: order exists");
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
        require(order.price != 0, "Mark3dExchange: order doesn't exist");
        require(!order.fulfilled, "Mark3dExchange: order was already fulfilled");
        require(msg.value == order.price, "Mark3dExchange: value must equal");
        require(whitelistDeadlines[token] == 0 || whitelistDeadlines[token] < block.timestamp, "Mark3dExchange: whitelist period");
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
        require(order.price != 0, "Mark3dExchange: order doesn't exist");
        require(!order.fulfilled, "Mark3dExchange: order was already fulfilled");
        require(whitelistDeadlines[token] != 0, "Mark3dExchange: collection doesn't have whitelist");
        require(whitelistDeadlines[token] > block.timestamp, "Mark3dExchange: whitelist deadline exceeds");
        bytes32 address_bytes = bytes32(uint256(uint160(_msgSender())));
        require(address_bytes.toEthSignedMessageHash().recover(signature) == owner(), "Mark3dExchange: whitelist invalid signature");
        uint256 discount = (order.price*whitelistDiscounts[token])/PERCENT_MULTIPLIER;
        uint256 discount_price = order.price - discount;
        require(msg.value == discount_price, "Mark3dExchange: value must equal price with discount");
        order.receiver = payable(_msgSender());
        order.fulfilled = true;
        order.token.completeTransferDraft(order.tokenId, order.receiver, publicKey, bytes(""));
    }

    function cancelOrder(
        IEncryptedFileToken token,
        uint256 tokenId
    ) external {
        Order storage order = orders[token][tokenId];
        require(order.price != 0, "Mark3dExchange: order doesn't exist");
        require(!order.fulfilled, "Mark3dExchange: order was fulfilled");
        order.token.cancelTransfer(tokenId);
    }

    function transferCancelled(uint256 tokenId) external {
        Order storage order = orders[IEncryptedFileToken(_msgSender())][tokenId];
        require(order.price != 0, "Mark3dExchange: order doesn't exist");
        if (order.fulfilled) {
            order.receiver.transfer(order.price);
        }
        delete orders[IEncryptedFileToken(_msgSender())][tokenId];
    }

    function transferFinished(uint256 tokenId) external {
        Order storage order = orders[IEncryptedFileToken(_msgSender())][tokenId];
        require(order.price != 0, "Mark3dExchange: order doesn't exist");
        require(order.fulfilled, "Mark3dExchange: order wasn't fulfilled");
        order.initiator.transfer(order.price);
        delete orders[IEncryptedFileToken(_msgSender())][tokenId];
    }

    function transferFraudDetected(uint256 tokenId, bool approved) external {
        Order storage order = orders[IEncryptedFileToken(_msgSender())][tokenId];
        require(order.price != 0, "Mark3dExchange: order doesn't exist");
        require(order.fulfilled, "Mark3dExchange: order wasn't fulfilled");
        if (approved) {
            order.receiver.transfer(order.price);
        } else {
            order.initiator.transfer(order.price);
        }
        delete orders[IEncryptedFileToken(_msgSender())][tokenId];
    }
}
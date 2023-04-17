// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "./IEncryptedFileToken.sol";
import "./IEncryptedFileTokenCallbackReceiver.sol";

contract Mark3dExchange is IEncryptedFileTokenCallbackReceiver, Context {
    struct Order {
        IEncryptedFileToken token;
        uint256 tokenId;
        uint256 price;
        address payable initiator;
        address payable receiver;
        bool fulfilled;
    }

    mapping(IEncryptedFileToken => mapping(uint256 => Order)) public orders;

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

    function placeBatchOrder(
        IEncryptedFileToken token,
        uint256[] calldata tokenIds,
        uint256 price
    ) external {
        require(price > 0, "Mark3dExchange: price must be positive");
        require(token.supportsInterface(type(IEncryptedFileToken).interfaceId));
        for (uint i = 0; i < tokenIds.length; i++) {
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
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./IFraudDecider.sol";
import "./IEncryptedFileToken.sol";

contract FraudDeciderWeb2V2 is IFraudDecider, AccessControl {
    event FraudReported(address collection, uint256 tokenId, string cid, bytes publicKey, bytes privateKey, bytes encryptedPassword);

    struct Report {
        IEncryptedFileToken tokenInstance;
        uint256 id;
        string cid;
        bytes publicKey;
        bytes privateKey;
        bytes encryptedPassword;
    }

    mapping(address => mapping(uint256 => Report)) public reports;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function decide(
        uint256 tokenId,
        string calldata cid,
        bytes calldata publicKey,
        bytes calldata privateKey,
        bytes calldata encryptedPassword
    ) external returns (bool, bool) {
        reports[_msgSender()][tokenId] = Report(IEncryptedFileToken(_msgSender()), tokenId, cid, publicKey, privateKey, encryptedPassword);
        emit FraudReported(_msgSender(), tokenId, cid, publicKey, privateKey, encryptedPassword);
        return (false, false);
    }

    function lateDecision(address tokenInstance, uint256 tokenId, bool approve) external onlyRole(DEFAULT_ADMIN_ROLE) {
        Report storage report = reports[tokenInstance][tokenId];
        require(bytes(report.cid).length != 0, "FraudDeciderWeb2V2: report doesn't exist");
        report.tokenInstance.applyFraudDecision(tokenId, approve);
    }
}
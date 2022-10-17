// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./IFraudDecider.sol";
import "./Mark3dCollection.sol";

contract FraudDeciderWeb2 is IFraudDecider, AccessControl {
    struct Report {
        Mark3dCollection tokenInstance;
        uint256 id;
        string cid;
        bytes publicKey;
        bytes privateKey;
        bytes encryptedPassword;
    }

    mapping(address => mapping(uint256 => Report)) reports;

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
        reports[_msgSender()][tokenId] = Report(Mark3dCollection(_msgSender()), tokenId, cid, publicKey, privateKey, encryptedPassword);
        return (false, false);
    }

    function lateDecision(address tokenInstance, uint256 tokenId, bool approve) external onlyRole(DEFAULT_ADMIN_ROLE) {
        Report storage report = reports[tokenInstance][tokenId];
        require(bytes(report.cid).length != 0, "FraudDeciderWeb2: report doesn't exist");
        report.tokenInstance.applyFraudDecision(tokenId, approve);
    }
}
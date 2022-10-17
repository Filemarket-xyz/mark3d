// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @notice Probably, this will be renamed to FRC...FraudDecider in the future
interface IFraudDecider {
    /// @dev Decide if there was a fact of fraud
    /// @param tokenId Id of token to check
    /// @param cid Cid of token metadata JSON-file
    /// @param publicKey Public key provided by token receiver
    /// @param privateKey Corresponding private key
    /// @param encryptedPassword Password to unlock file encrypted by current token owner with receiver's public key
    /// @return Boolean indicated if decision was made and boolean indicating if there was really act of the fraud
    /// @notice As this standard was developing in early stages of FVM, we've allowed this function to just record,
    /// if some transfer needs further investigation, because without FVM we are not able to make instant decision.
    /// However, with FVM we will be able to verify fraud report instantly
    function decide(
        uint256 tokenId,
        string calldata cid,
        bytes calldata publicKey,
        bytes calldata privateKey,
        bytes calldata encryptedPassword
    ) external returns (bool, bool);
}

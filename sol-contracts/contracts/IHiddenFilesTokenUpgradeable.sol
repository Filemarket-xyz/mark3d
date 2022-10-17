// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "./IHiddenFilesTokenOnTransfer.sol";
import "./IFraudDecider.sol";

interface IHiddenFilesTokenUpgradeable is IERC721Upgradeable {
    /// @dev Function to detect if fraud decision instant. Should return false in EVM chains and true in Filecoin
    /// @return Boolean indicating if fraud decision will be instant
    function fraudDecisionInstant() external view returns (bool);

    /// @dev Function to get fraud decider instance for this token
    /// @return IFraudDecider instance
    function fraudDecider() external view returns (IFraudDecider);

    /// @dev Init token transfer. Shortcut for draftTransfer+completeTransferDraft
    /// @notice MUST revert if the caller is not owner of token or approved address
    /// @notice MUST revert if transfer process for token has been initiated already
    /// @param tokenId is id for token to transfer
    /// @param to token receiver
    /// @param data transfer data
    /// @param callbackReceiver is contract on which callbacks will be called. zero address if not needed
    function initTransfer(
        uint256 tokenId,
        address to,
        bytes calldata data,
        IHiddenFilesTokenOnTransfer callbackReceiver
    ) external;

    /// @dev Draft transfer. This method is useful if some third party need to lock NFT before receiver will be defined
    /// @notice MUST revert if the caller is not owner of token or approved address
    /// @notice MUST revert if transfer process for token has been initiated already
    /// @param tokenId is id for token to transfer
    /// @param callbackReceiver is contract on which callbacks will be called. zero address if not needed
    function draftTransfer(
        uint256 tokenId,
        IHiddenFilesTokenOnTransfer callbackReceiver
    ) external;

    /// @dev Complete transfer draft
    /// @notice MUST revert if there is no transfer draft for this token
    /// @notice MUST revert if called not by transfer draft creator
    /// @notice MUST revert if transfer exists and is not in draft state
    /// @param tokenId is id for token to transfer
    /// @param to is token receiver
    /// @param data is transfer data
    function completeTransferDraft(
        uint256 tokenId,
        address to,
        bytes calldata data
    ) external;

    /// @dev Set receiver public key
    /// @notice MUST revert if transfer process wasn't initiated or it exists but is in wrong state
    /// @notice MUST revert if called not by receiver itself
    /// @notice publicKey here doesn't relate to account private/public. It is some external key from asymmetric encryption key-pair
    /// @param tokenId is id for token to transfer
    /// @param publicKey is receiver public key
    function setTransferPublicKey(
        uint256 tokenId,
        bytes calldata publicKey
    ) external;

    /// @dev Approve transfer and save encrypted password
    /// @notice MUST revert if transfer process wasn't initiated or it exists but is in wrong state
    /// @notice MUST revert if called not by sender itself even if transfer was created by third party
    /// @param tokenId is id for token to transfer
    /// @param encryptedSecret is encrypted by receiver public key secret to decrypt hidden file
    function approveTransfer(
        uint256 tokenId,
        bytes calldata encryptedSecret
    ) external;

    /// @dev Finalize transfer
    /// @notice MUST revert if transfer process wasn't initiated or it exists but is in wrong state
    /// @notice MUST revert if called not by token receiver
    /// @notice This function MUST call `transferFinished` callback function
    /// @param tokenId is id for token to transfer
    function finalizeTransfer(
        uint256 tokenId
    ) external;

    /// @dev Report fraud
    /// @notice Within this function fraud MUST be checked by IFraudDecider and if there is and instant decision, abandon transfer and call the callback
    /// @notice MUST revert if transfer process wasn't initiated or it exists but is in wrong state
    /// @notice MUST revert if called not by token receiver
    /// @notice This function MUST call `transferFraudDetected` callback function in case of instant decision
    /// @param tokenId is id for token to transfer
    function reportFraud(
        uint256 tokenId,
        bytes calldata privateKey
    ) external;

    /// @dev Apply fraud decision, abandon transfer and call the callback
    /// @notice MUST revert if fraud decision making instant for this token instance
    /// @notice MUST revert if called not by fraud decider linked to this token
    /// @notice MUST revert if transfer process wasn't initiated or it exists but is in wrong state
    /// @notice This function MUST call `transferFraudDetected` callback function
    /// @param tokenId is id for token to transfer
    /// @param approve equals true if fact of fraud was proved/false if absence of fraud was proved
    function applyFraudDecision(
        uint256 tokenId,
        bool approve
    ) external;

    /// @dev Cancel transfer
    /// @notice This function MUST call `transferCancelled` callback function
    /// Following cases are allowed:
    /// 1. Current owner or transfer initiator cancels transfer before completing draft
    /// 2. Current owner cancels transfer before public key was set by receiver
    /// 3. Current owner cancels transfer before encrypted password was set
    /// 4. Current owner cancels transfer before receiver finalize it or report fraud
    /// @param tokenId is id for token to transfer
    function cancelTransfer(
        uint256 tokenId
    ) external;

    /// @dev MUST revert always
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) external override(IERC721Upgradeable);

    /// @dev MUST revert always
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external override(IERC721Upgradeable);

    /// @dev MUST revert always
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external override(IERC721Upgradeable);
}
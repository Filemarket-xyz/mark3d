# Mark3d transfer protocol
| Header   | Value                                                                          |
|----------|--------------------------------------------------------------------------------|
| Author   | Oleg Shatniuk, Andrey Korolov, Stanislav Santalov, Ilya Orlov, Mikhail Korolov |
| Status   | Idea                                                                           |
| Type     | Standard                                                                       |
| Category | Standard                                                                       |
| Created  | 28-08-2022                                                                     |

## Table of contents
* [Simple Summary](#simple-summary)
* [Abstract](#abstract)
* [Motivation](#motivation)
* [Specification](#specification)
* [Implementation](#implementation)
* [History](#history)
* [Copyright](#copyright)
## Simple Summary
A standard interface for NFT with encrypted image or hidden file
## Abstract
The following standard allows for implementation of a standard API for Non Fungible Tokens(NFT) with encrypted image or hidden file.
The standard is an extension of ERC721 standard.
## Motivation
With Filecoin and FVM there is ability of building decentralized applications with
advanced logic with huge amount of data, such as encryption and decryption.

Encryption of NFT files (Hidden files) can solve problem of availability of content to anyone.

In other words, with Filecoin and FVM private NFT can be implemented.
## Specification
The key words “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “MAY”, and “OPTIONAL” in this document are to be interpreted as described in RFC 2119.

```solidity
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

/// @dev Interface for third party to receive transfer updates from token contract instances
interface IHiddenFilesTokenCallbackReceiver {
    /// @dev This function MUST be called if transfer is cancelled
    /// @param tokenId Id of token for which transfer was cancelled
    function transferCancelled(uint256 tokenId) external;

    /// @dev This function MUST be called if transfer is finished successfully
    /// @param tokenId Id of token for which transfer was finished
    function transferFinished(uint256 tokenId) external;

    /// @dev This function MUST be called if transfer is finished with fraud report
    /// @param tokenId Id of token for which transfer was finished
    /// @param approved indicates if there was really fact of the fraud
    function transferFraudDetected(uint256 tokenId, bool approved) external;
}

interface IHiddenFilesToken is IERC721 {
    /// @dev Event emitted after transfer creation
    event TransferInit(uint256 indexed tokenId, address from, address to);

    /// @dev Event emitted after transfer draft creation
    event TransferDraft(uint256 indexed tokenId, address from);

    /// @dev Event emitted after transfer draft completion
    event TransferDraftCompletion(uint256 indexed tokenId, address to);

    /// @dev Event emitted after setting receiver's public key
    event TransferPublicKeySet(uint256 indexed tokenId, bytes publicKey);

    /// @dev Event emitted after setting encrypted file password
    event TransferPasswordSet(uint256 indexed tokenId, bytes encryptedPassword);

    /// @dev Event emitted after transfer successful finish
    event TransferFinished(uint256 indexed tokenId);

    /// @dev Event emitted after fraud was reported
    event TransferFraudReported(uint256 indexed tokenId, bool decided, bool approved);

    /// @dev Event emitted after transfer was cancelled
    event TransferCancellation(uint256 indexed tokenId);

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
        IHiddenFilesTokenCallbackReceiver callbackReceiver
    ) external;

    /// @dev Draft transfer. This method is useful if some third party need to lock NFT before receiver will be defined
    /// @notice MUST revert if the caller is not owner of token or approved address
    /// @notice MUST revert if transfer process for token has been initiated already
    /// @param tokenId is id for token to transfer
    /// @param callbackReceiver is contract on which callbacks will be called. zero address if not needed
    function draftTransfer(
        uint256 tokenId,
        IHiddenFilesTokenCallbackReceiver callbackReceiver
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
        bytes calldata publicKey,
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
    ) external override;

    /// @dev MUST revert always
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external override;

    /// @dev MUST revert always
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external override;
}
```
## Implementation
[Reference implementation](./contracts/Mark3dCollection.sol)
## History
## Copyright
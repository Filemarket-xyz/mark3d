// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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

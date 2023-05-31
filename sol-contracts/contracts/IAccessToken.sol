// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "./IFraudDecider.sol";
import "./IEncryptedFileTokenUpgradeableV2.sol";

interface IAccessToken is IERC721Enumerable {
    event CollectionCreation(uint256 indexed tokenId, address indexed instance);
    
    /// @dev TokenData - struct with basic token data
    struct TokenData {
        uint256 id;             // token id
        string metaUri;         // metadata uri
        bytes data;             // additional data
    }

    /// @dev PrivateCollectionData - struct for collections list getter
    struct PrivateCollectionData {
        uint256 tokenId;                                 // access token id
        IEncryptedFileTokenUpgradeableV2 contractAddress;  // collection contract address
        bytes data;                                      // additional meta data of collection
    }

    /// @dev function for collection creating and cloning
    /// @param salt - value for cloning procedure to make address deterministic
    /// @param name - name of private collection token
    /// @param symbol - symbol of private collection token
    /// @param _contractMetaUri - contract-level metadata uri
    /// @param accessTokenMetaUri - metadata uri for access token
    /// @param royaltyReceiver - address that will receive royalty
    /// @param data - private collection metadata
    function createCollection(
        bytes32 salt,
        string memory name,
        string memory symbol,
        string memory _contractMetaUri,
        string memory accessTokenMetaUri,
        address royaltyReceiver,
        bytes memory data
    ) external;

    /// @dev function for prediction of address of new collection
    /// @param salt - salt value for cloning
    /// @return predicted address of clone
    function predictDeterministicAddress(bytes32 salt) external view returns (address);

    /// @dev function for changing private collection implementation
    /// @param _implementation - address of new instance of private collection
    function setImplementation(IEncryptedFileTokenUpgradeableV2 _implementation) external;
    
    /// @dev Set contract-level metadata URI
    /// @param _contractMetaUri - new metadata URI
    function setContractMetaUri(
        string memory _contractMetaUri
    ) external;
}
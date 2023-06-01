// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "./IAccessToken.sol";
import "./IFraudDecider.sol";
import "./IEncryptedFileTokenUpgradeableV2.sol";

contract Mark3dAccessTokenV2 is IAccessToken, ERC721Enumerable, AccessControl, Ownable {
    using Clones for address;
    using EnumerableSet for EnumerableSet.Bytes32Set;

    mapping(uint256 => IEncryptedFileTokenUpgradeableV2) public tokenCollections;   // mapping from access token id to collection
    uint256 public tokensCount;                                                   // count of collections
    IEncryptedFileTokenUpgradeableV2 public implementation;                         // collection contract implementation for cloning
    string private contractMetaUri;                                               // contract-level metadata
    mapping(uint256 => string) public tokenUris;                                  // mapping of token metadata uri
    bool public fraudLateDecisionEnabled;
    IFraudDecider public fraudDecider;
    bytes public globalSalt;

    /// @dev check if call was made from private collection
    modifier onlyPrivateCollection(uint256 tokenId) {
        require(_msgSender() == address(tokenCollections[tokenId]), "Mark3dAccessTokenV2: call is enabled only for IEncryptedFileTokenUpgradeableV2 instances");
        _;
    }

    /// @dev constructor
    /// @param name - access token name
    /// @param symbol - access token symbol
    /// @param _contractMetaUri - contract-level metadata uri
    /// @param _implementation - address of PrivateCollection contract for cloning
    constructor(
        string memory name,
        string memory symbol,
        string memory _contractMetaUri,
        bytes memory _globalSalt,
        IEncryptedFileTokenUpgradeableV2 _implementation,
        bool _fraudLateDecisionEnabled,
        IFraudDecider _fraudDecider
    ) ERC721(name, symbol) {
        contractMetaUri = _contractMetaUri;
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        implementation = _implementation;
        fraudLateDecisionEnabled = _fraudLateDecisionEnabled;
        fraudDecider = _fraudDecider;
        globalSalt = _globalSalt;
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
    ) external {
        uint256 tokenId = tokensCount;
        _mint(_msgSender(), tokenId);
        address instance = address(implementation).cloneDeterministic(salt);
        tokenCollections[tokenId] = IEncryptedFileTokenUpgradeableV2(instance);
        tokenUris[tokenId] = accessTokenMetaUri;
        IEncryptedFileTokenUpgradeableV2(instance).initialize(name, symbol, _contractMetaUri,
            this, tokenId, _msgSender(), royaltyReceiver, data, fraudDecider, fraudLateDecisionEnabled);
        tokensCount++;

        emit CollectionCreation(tokenId, instance);
    }

    /// @dev function for prediction of address of new collection
    /// @param salt - salt value for cloning
    /// @return predicted address of clone
    function predictDeterministicAddress(bytes32 salt) external view returns (address) {
        return address(implementation).predictDeterministicAddress(salt, address(this));
    }

    /// @dev function for changing private collection implementation
    /// @param _implementation - address of new instance of private collection
    function setImplementation(IEncryptedFileTokenUpgradeableV2 _implementation) external onlyRole(DEFAULT_ADMIN_ROLE) {
        implementation = _implementation;
    }

    /// @dev Set contract-level metadata URI
    /// @param _contractMetaUri - new metadata URI
    function setContractMetaUri(
        string memory _contractMetaUri
    ) external onlyOwner {
        contractMetaUri = _contractMetaUri;
    }

    /// @dev Returns the Uniform Resource Identifier (URI) for `tokenId` token.
    /// @return Metadata file URI
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return tokenUris[tokenId];
    }

    /// @dev inheritance conflict solving
    function supportsInterface(bytes4 interfaceId) public view override(AccessControl, ERC721Enumerable, IERC165) returns (bool) {
        return AccessControl.supportsInterface(interfaceId) || ERC721Enumerable.supportsInterface(interfaceId);
    }

    /// @dev Contract-level metadata for OpenSea
    /// @return Metadata file URI
    function contractURI() public view returns (string memory) {
        return contractMetaUri;
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "./IFraudDecider.sol";
import "./Mark3dCollection.sol";

contract Mark3dAccessToken is ERC721Enumerable, AccessControl, Ownable {
    using Clones for address;
    using EnumerableSet for EnumerableSet.Bytes32Set;

    event CollectionCreation(uint256 indexed tokenId, address indexed instance);

    /// @dev PrivateCollectionData - struct for collections list getter
    struct PrivateCollectionData {
        uint256 tokenId;                                // access token id
        Mark3dCollection contractAddress;               // collection contract address
        bytes data;                                     // additional meta data of collection
    }
    mapping(uint256 => Mark3dCollection) public tokenCollections;                 // mapping from access token id to collection
    uint256 public tokensCount;                                                   // count of collections
    Mark3dCollection public implementation;                                       // collection contract implementation for cloning
    string private contractMetaUri;                                               // contract-level metadata
    mapping(uint256 => string) public tokenUris;                                  // mapping of token metadata uri
    mapping(address => EnumerableSet.Bytes32Set) private ownedCollections;        // sets of owned collections or collections in which at least one token owned
    bool public fraudLateDecisionEnabled;
    IFraudDecider public fraudDecider;
    bytes public globalSalt;

    /// @dev check if call was made from private collection
    modifier onlyPrivateCollection(uint256 tokenId) {
        require(_msgSender() == address(tokenCollections[tokenId]), "Mark3dAccessToken: call is enabled only for Mark3dCollection instances");
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
        Mark3dCollection _implementation,
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
    /// @param data - private collection metadata
    function createCollection(
        bytes32 salt,
        string memory name,
        string memory symbol,
        string memory _contractMetaUri,
        string memory accessTokenMetaUri,
        bytes memory data
    ) external {
        uint256 tokenId = tokensCount;
        _mint(_msgSender(), tokenId);
        address instance = address(implementation).cloneDeterministic(salt);
        tokenCollections[tokenId] = Mark3dCollection(instance);
        tokenUris[tokenId] = accessTokenMetaUri;
        Mark3dCollection(instance).initialize(name, symbol, _contractMetaUri,
            this, tokenId, _msgSender(), data, fraudDecider, fraudLateDecisionEnabled);
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
    function setImplementation(Mark3dCollection _implementation) external onlyRole(DEFAULT_ADMIN_ROLE) {
        implementation = _implementation;
    }

    /// @dev function for retrieving collections list. Implemented using basic pagination.
    /// @param page - page number (starting from zero)
    /// @param size - size of the page
    /// @return collection list and owned tokens count for each collection
    /// @notice This function is potentially unsafe, since it doesn't guarantee order (use fixed block number)
    function getSelfCollections(
        uint256 page,
        uint256 size
    ) external view returns (PrivateCollectionData[] memory, uint256[] memory, uint256) {
        require(size <= 1000, "Mark3dAccessToken: size must be 1000 or lower");
        uint256 total = ownedCollections[_msgSender()].length();
        require((total == 0 && page == 0) || page * size < total, "Mark3dAccessToken: out of bounds");
        uint256 resSize = size;
        if ((page + 1) * size > total) {
            resSize = total - page * size;
        }
        PrivateCollectionData[] memory res = new PrivateCollectionData[](resSize);
        uint256[] memory counts = new uint256[](resSize);
        for (uint256 i = page * size; i < page * size + resSize; i++) {
            uint256 tokenId = uint256(ownedCollections[_msgSender()].at(i));
            res[i - page * size] = PrivateCollectionData(tokenId, tokenCollections[tokenId],
                tokenCollections[tokenId].collectionData());
            counts[i - page * size] = tokenCollections[tokenId].balanceOf(_msgSender());
        }
        return (res, counts, total);
    }

    /// @dev function for retrieving token lists. Implemented using basic pagination.
    /// @param ids - ids of tokens
    /// @param pages - page numbers (starting from zero)
    /// @param sizes - sizes of the pages
    /// @return owned token lists
    /// @notice This function is potentially unsafe, since it doesn't guarantee order (use fixed block number)
    function getSelfTokens(
        uint256[] calldata ids,
        uint256[] calldata pages,
        uint256[] calldata sizes
    ) external view returns (Mark3dCollection.TokenData[][] memory, uint256[] memory) {
        require(ids.length <= 1000, "Mark3dAccessToken: collections quantity must be 1000 or lower");
        require(ids.length == pages.length && pages.length == sizes.length, "Mark3dAccessToken: lengths unmatch");
        Mark3dCollection.TokenData[][] memory res = new Mark3dCollection.TokenData[][](ids.length);
        uint256 realSize = 0;
        uint256[] memory resSizes = new uint256[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            require(address(tokenCollections[ids[i]]) != address(0), "Mark3dAccessToken: collection doesn't exist");
            uint256 total = tokenCollections[ids[i]].balanceOf(_msgSender());
            require((total == 0 && pages[i] == 0) || pages[i] * sizes[i] < total, "Mark3dAccessToken: out of bounds");
            resSizes[i] = sizes[i];
            if ((pages[i] + 1) * sizes[i] > total) {
                resSizes[i] = total - pages[i] * sizes[i];
            }
            realSize += resSizes[i];
            res[i] = new Mark3dCollection.TokenData[](resSizes[i]);
        }
        require(realSize <= 1000, "Mark3dAccessToken: tokens quantity must be 1000 or lower");
        for (uint256 i = 0; i < ids.length; i++) {
            Mark3dCollection collection = tokenCollections[ids[i]];
            for (uint256 j = pages[i] * sizes[i]; j < pages[i] * sizes[i] + resSizes[i]; j++) {
                uint256 tokenId = collection.tokenOfOwnerByIndex(_msgSender(), j);
                res[i][j - pages[i] * sizes[i]] = Mark3dCollection.TokenData(tokenId,
                    collection.tokenUris(tokenId), collection.tokenData(tokenId));
            }
        }

        uint256[] memory totals = new uint256[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            totals[i] = tokenCollections[ids[i]].balanceOf(_msgSender());
        }
        return (res, totals);
    }

    /// @dev Set contract-level metadata URI
    /// @param _contractMetaUri - new metadata URI
    function setContractMetaUri(
        string memory _contractMetaUri
    ) external onlyOwner {
        contractMetaUri = _contractMetaUri;
    }

    /// @dev function for updating private collection sets. Can be called only by PrivateCollection
    /// @param from - address of sender
    /// @param to - address of receiver
    /// @param tokenId - token id
    function updateCollectionIndex(
        address from,
        address to,
        uint256 tokenId
    ) external onlyPrivateCollection(tokenId) {
        if (from != address(0) && tokenCollections[tokenId].balanceOf(from) == 0 && ownerOf(tokenId) != from) {
            ownedCollections[from].remove(bytes32(tokenId));
        }

        if (to != address(0) && !ownedCollections[to].contains(bytes32(tokenId))) {
            ownedCollections[to].add(bytes32(tokenId));
        }
    }

    /// @dev Returns the Uniform Resource Identifier (URI) for `tokenId` token.
    /// @return Metadata file URI
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return tokenUris[tokenId];
    }

    /// @dev inheritance conflict solving
    function supportsInterface(bytes4 interfaceId) public view override(AccessControl, ERC721Enumerable) returns (bool) {
        return AccessControl.supportsInterface(interfaceId) || ERC721Enumerable.supportsInterface(interfaceId);
    }

    /// @dev Contract-level metadata for OpenSea
    /// @return Metadata file URI
    function contractURI() public view returns (string memory) {
        return contractMetaUri;
    }

    /// @dev callback implementation for updating collections sets
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721) {
        super._afterTokenTransfer(from, to, tokenId);
        if (from != address(0) && to != address(0)) {
            tokenCollections[tokenId].transferOwnership(to);
        }
        if (from != address(0)) {
            ownedCollections[from].remove(bytes32(tokenId));
        }
        if (to != address(0) && !ownedCollections[to].contains(bytes32(tokenId))) {
            ownedCollections[to].add(bytes32(tokenId));
        }
    }
}
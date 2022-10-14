// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";

import "./Mark3dAccessToken.sol";
import "./IFraudDecider.sol";

contract Mark3dCollection is ERC721EnumerableUpgradeable, AccessControl {
    /// @dev TokenData - struct with basic token data
    struct TokenData {
        uint256 id;             // token id
        string metaUri;         // metadata uri
        bytes data;             // additional data
    }

    /// @dev
    struct TransferInfo {
        uint256 id;                // token id
        address initiator;         // transfer initiator
        address to;                // transfer target
        bytes data;                // transfer data
        bytes publicKey;           // public key of receiver
        bytes encryptedPassword;   // encrypted password
        bool fraudReported;        // if fraud reported while finalizing transfer
    }

    bytes32 public FRAUD_DECIDER_ADMIN_ROLE;
    uint256 public accessTokenId;                              // access token id
    Mark3dAccessToken public accessToken;                      // Access token contract address
    bytes public data;                                         // collection additional data
    string private contractMetaUri;                            // contract-level metadata
    mapping(uint256 => string) public tokenUris;               // mapping of token metadata uri
    mapping(uint256 => bytes) public tokenData;                // mapping of token additional data
    uint256 tokensLimit;                                       // mint limit
    mapping(uint256 => TransferInfo) transfers;                // transfer details
    bool fraudLateDecisionEnabled;
    FraudDecider fraudDecider;

    /// @dev initialize function
    /// @param name - name of the token
    /// @param symbol - symbol of the token
    /// @param _contractMetaUri - contract-level metadata uri
    /// @param _accessToken - access token contract address
    /// @param _accessTokenId - access token id
    /// @param _owner - collection creator
    /// @param _data - additional collection data
    function initialize(
        string memory name,
        string memory symbol,
        string memory _contractMetaUri,
        Mark3dAccessToken _accessToken,
        uint256 _accessTokenId,
        address _owner,
        FraudDecider _fraudDecider,
        bool _fraudLateDecisionEnabled,
        bytes memory _data
    ) external initializer {
        __ERC721_init(name, symbol);
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());

        tokensCount = 0;
        contractMetaUri = _contractMetaUri;
        accessTokenId = _accessTokenId;
        accessToken = _accessToken;
        data = _data;
        tokensLimit = 100;
        fraudDecider = _fraudDecider;
        fraudLateDecisionEnabled = _fraudLateDecisionEnabled;
    }

    /// @dev inheritance conflict solving
    function supportsInterface(bytes4 interfaceId) public view override(AccessControl, ERC721Enumerable) returns (bool) {
        return AccessControl.supportsInterface(interfaceId) || ERC721Enumerable.supportsInterface(interfaceId);
    }

    /// @dev Mint function. Can called only by the owner
    /// @param to - token receiver
    /// @param id - token id
    /// @param metaUri - metadata uri
    /// @param _data - additional token data
    function mint(
        address to,
        uint256 id,
        string memory metaUri,
        bytes memory _data
    ) external onlyOwner {
        require(id < tokensLimit, "Mark3dCollection: limit reached");
        _mint(to, id, metaUri, _data);
    }

    /// @dev Mint function without id. Can called only by the owner. Equivalent to mint(to, tokensCount(), metaUri, _data)
    /// @param to - token receiver
    /// @param metaUri - metadata uri
    /// @param _data - additional token data
    function mintWithoutId(
        address to,
        string memory metaUri,
        bytes memory _data
    ) external onlyOwner returns (uint256) {
        uint256 id = tokensCount;
        require(id < tokensLimit, "Mark3dCollection: limit reached");
        _mint(to, id, metaUri, _data);
        return id;
    }

    /// @dev Mint batch of tokens. Can called only by the owner
    /// @param to - tokens receiver
    /// @param count - tokens quantity to mint
    /// @param metaUris - metadata uri list
    /// @param _data - additional token data list
    function mintBatch(address to, uint256 count, string[] memory metaUris, bytes[] memory _data) external onlyOwner {
        require(count == metaUris.length, "Mark3dCollection: metaUri list length must be equal to count");
        require(count == _data.length, "Mark3dCollection: _data list length must be equal to count");
        uint256 id = tokensCount;
        for (uint256 i = 0; i < count; i++) {
            require(id < tokensLimit, "Mark3dCollection: limit reached");
            _mint(to, id, metaUris[i], _data[i]);
            id++;
        }
    }

    /// @dev burn function
    /// @param id - token id
    function burn(uint256 id) external {
        require(ownerOf(id) == _msgSender(), "Mark3dCollection: not an owner of token");
        _burn(id);
    }

    function initTransfer(uint256 tokenId, address to, bytes calldata data) external {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Mark3dCollection: caller is not token owner or approved");
        require(transfers[tokenId].to == address(0), "Mark3dCollection: transfer for this token was already created");
        transfers[tokenId] = TransferInfo(tokenId, _msgSender(), to, data, bytes(""), bytes(""), false);
    }

    function setTransferPublicKey(uint256 tokenId, bytes calldata publicKey) external {
        TransferInfo storage info = transfers[tokenId];
        require(info.to != address(0), "Mark3dCollection: transfer for this token wasn't created");
        require(info.to == _msgSender(), "Mark3dCollection: permission denied");
        require(string(info.publicKey) == "", "Mark3dCollection: public key was already set");
        info.publicKey = publicKey;
    }

    function approveTransfer(uint256 tokenId, bytes calldata encryptedPassword) external {
        TransferInfo storage info = transfers[tokenId];
        require(transfers[tokenId].to != address(0), "Mark3dCollection: transfer for this token wasn't created");
        require(ownerOf(tokenId) == _msgSender(), "Mark3dCollection: permission denied");
        require(string(info.publicKey) != "", "Mark3dCollection: public key wasn't set yet");
        require(string(info.encryptedPassword) == "", "Mark3dCollection: encrypted password was already set");
        info.encryptedPassword = encryptedPassword;
    }

    function finalizeTransfer(uint256 tokenId, bool success) external {
        TransferInfo storage info = transfers[tokenId];
        require(transfers[tokenId].to != address(0), "Mark3dCollection: transfer for this token wasn't created");
        require(info.to == _msgSender(), "Mark3dCollection: permission denied");
        require(string(info.encryptedPassword) != "", "Mark3dCollection: encrypted password wasn't set yet");
        if (success) {
            _safeTransfer(ownerOf(tokenId), info.to, tokenId, info.data);
        } else {
            info.fraudReported = true;
            (bool decided, bool approve) = fraudDecider.decide(tokenId);
            require(fraudLateDecisionEnabled || decided, "Mark3dCollection: late decision disabled");
            info.fraudReported = true;
        }
    }

    function fraudLateDecision(uint256 tokenId, bool approve) external {
        TransferInfo storage info = transfers[tokenId];
        require(transfers[tokenId].to != address(0), "Mark3dCollection: transfer for this token wasn't created");
        require(_msgSender() == address(FraudDecider), "Mark3dCollection: permission denied");
        require(info.fraudReported, "Mark3dCollection: fraud was not reported");
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable override {
        revert("common transfer disabled");
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable override {
        revert("common transfer disabled");
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) external payable override {
        revert("common transfer disabled");
    }
}
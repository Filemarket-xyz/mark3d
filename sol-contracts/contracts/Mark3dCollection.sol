// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "./Mark3dAccessToken.sol";

contract Mark3dCollection is ERC721EnumerableUpgradeable {
    /// @dev TokenData - struct with basic token data
    struct TokenData {
        uint256 id;             // token id
        string metaUri;         // metadata uri
        bytes data;             // additional data
    }

    uint256 public accessTokenId;                              // access token id
    Mark3dAccessToken public accessToken;                      // Access token contract address
    bytes public data;                                         // collection additional data
    uint256 tokensLimit;                                       // mint limit

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
        bytes memory _data
    ) external initializer {
        __MinterCollection_init(name, symbol, _contractMetaUri, _owner);
        accessTokenId = _accessTokenId;
        accessToken = _accessToken;
        data = _data;
        tokensLimit = 100;
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

    function initTransfer(address from, address to, uint256 tokenId, bytes publicKey) external {

    }

    function approveTransfer(uint256 tokenId, bytes encryptedPassword) external {

    }

    function finalizeTransfer(uint256 tokenId, bool success) external {

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
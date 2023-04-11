// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./Mark3dAccessToken.sol";
import "./IFraudDecider.sol";
import "./IEncryptedFileToken.sol";
import "./IEncryptedFileTokenUpgradeable.sol";
import "./IEncryptedFileTokenCallbackReceiver.sol";

contract Mark3dCollection is IEncryptedFileTokenUpgradeable, ERC721EnumerableUpgradeable, OwnableUpgradeable {
    /// @dev TokenData - struct with basic token data
    struct TokenData {
        uint256 id;             // token id
        string metaUri;         // metadata uri
        bytes data;             // additional data
    }

    /// @dev TransferInfo - transfer process info
    struct TransferInfo {
        uint256 id;                                             // token id
        address initiator;                                      // transfer initiator
        address from;                                           // transfer sender
        address to;                                             // transfer target
        IEncryptedFileTokenCallbackReceiver callbackReceiver;  // callback receiver
        bytes data;                                             // transfer data
        bytes publicKey;                                        // public key of receiver
        bytes encryptedPassword;                                // encrypted password
        bool fraudReported;                                     // if fraud reported while finalizing transfer
        uint256 publicKeySetAt;                                 // public key set at
        uint256 passwordSetAt;                                  // password set at
    }

    uint256 public accessTokenId;                              // access token id
    Mark3dAccessToken public accessToken;                      // Access token contract address
    bytes public collectionData;                               // collection additional data
    string private contractMetaUri;                            // contract-level metadata
    mapping(uint256 => string) public tokenUris;               // mapping of token metadata uri
    mapping(uint256 => bytes) public tokenData;                // mapping of token additional data
    uint256 public tokensCount;                                // count of minted tokens
    uint256 public tokensLimit;                                // mint limit
    mapping(uint256 => TransferInfo) private transfers;        // transfer details
    mapping(uint256 => uint256) public transferCounts;          // count of transfers per transfer
    bool private fraudLateDecisionEnabled;                     // false if fraud decision is instant
    IFraudDecider private fraudDecider_;                       // fraud decider

    /// @dev modifier for checking if call is from the access token contract
    modifier onlyAccessToken() {
        require(_msgSender() == address(accessToken), "Mark3dCollection: allowed to call only from access token");
        _;
    }

    /// @dev initialize function
    /// @param name - name of the token
    /// @param symbol - symbol of the token
    /// @param _contractMetaUri - contract-level metadata uri
    /// @param _accessToken - access token contract address
    /// @param _accessTokenId - access token id
    /// @param _owner - collection creator
    /// @param _data - additional collection data
    /// @param _fraudDecider - fraud decider instance
    /// @param _fraudLateDecisionEnabled - if fraud decision is not instant
    function initialize(
        string memory name,
        string memory symbol,
        string memory _contractMetaUri,
        Mark3dAccessToken _accessToken,
        uint256 _accessTokenId,
        address _owner,
        bytes memory _data,
        IFraudDecider _fraudDecider,
        bool _fraudLateDecisionEnabled
    ) external initializer {
        __ERC721_init(name, symbol);

        tokensCount = 0;
        contractMetaUri = _contractMetaUri;
        accessTokenId = _accessTokenId;
        accessToken = _accessToken;
        collectionData = _data;
        tokensLimit = 10000;
        fraudDecider_ = _fraudDecider;
        fraudLateDecisionEnabled = _fraudLateDecisionEnabled;
        _transferOwnership(_owner);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721EnumerableUpgradeable, IERC165Upgradeable) returns (bool) {
        return
        interfaceId == type(IEncryptedFileTokenUpgradeable).interfaceId ||
        interfaceId == type(IEncryptedFileToken).interfaceId ||
        super.supportsInterface(interfaceId);
    }

    /// @dev Returns the Uniform Resource Identifier (URI) for `tokenId` token.
    /// @return Metadata file URI
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return tokenUris[tokenId];
    }

    /// @dev Function to detect if fraud decision instant. Should return false in EVM chains and true in Filecoin
    /// @return Boolean indicating if fraud decision will be instant
    function fraudDecisionInstant() external view returns (bool) {
        return !fraudLateDecisionEnabled;
    }

    /// @dev Function to get fraud decider instance for this token
    /// @return IFraudDecider instance
    function fraudDecider() external view returns (IFraudDecider) {
        return fraudDecider_;
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
        require(bytes(metaUri).length > 0, "Mark3dCollection: empty meta uri");
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
        require(bytes(metaUri).length > 0, "Mark3dCollection: empty meta uri");
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

    function getTransferInfo(uint256 tokenId) external view returns (TransferInfo memory) {
        return transfers[tokenId];
    }

    /**
     * @dev See {IEncryptedFileToken-initTransfer}.
     */
    function initTransfer(
        uint256 tokenId,
        address to,
        bytes calldata data,
        IEncryptedFileTokenCallbackReceiver callbackReceiver
    ) external {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Mark3dCollection: caller is not token owner or approved");
        require(transfers[tokenId].initiator == address(0), "Mark3dCollection: transfer for this token was already created");
        transfers[tokenId] = TransferInfo(tokenId, _msgSender(), _msgSender(), to,
            callbackReceiver, data, bytes(""), bytes(""), false, 0, 0);
        transferCounts[tokenId]++;
        emit TransferInit(tokenId, ownerOf(tokenId), to, transferCounts[tokenId]);
    }

    /**
     * @dev See {IEncryptedFileToken-draftTransfer}.
     */
    function draftTransfer(
        uint256 tokenId,
        IEncryptedFileTokenCallbackReceiver callbackReceiver
    ) external {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Mark3dCollection: caller is not token owner or approved");
        require(transfers[tokenId].initiator == address(0), "Mark3dCollection: transfer for this token was already created");
        transfers[tokenId] = TransferInfo(tokenId, _msgSender(), ownerOf(tokenId), address(0),
            callbackReceiver, bytes(""), bytes(""), bytes(""), false, 0, 0);
        emit TransferDraft(tokenId, ownerOf(tokenId), transferCounts[tokenId]);
    }

    /**
     * @dev See {IEncryptedFileToken-completeTransferDraft}.
     */
    function completeTransferDraft(
        uint256 tokenId,
        address to,
        bytes calldata publicKey,
        bytes calldata data
    ) external {
        require(publicKey.length > 0, "Mark3dCollection: empty public key");
        TransferInfo storage info = transfers[tokenId];
        require(info.initiator != address(0), "Mark3dCollection: transfer for this token wasn't created");
        require(_msgSender() == info.initiator, "Mark3dCollection: permission denied");
        require(info.to == address(0), "Mark3dCollection: draft already complete");
        info.to = to;
        info.data = data;
        info.publicKey = publicKey;
        info.publicKeySetAt = block.timestamp;
        emit TransferDraftCompletion(tokenId, to);
        emit TransferPublicKeySet(tokenId, publicKey);
    }

    /**
     * @dev See {IEncryptedFileToken-setTransferPublicKey}.
     */
    function setTransferPublicKey(uint256 tokenId, bytes calldata publicKey, uint256 transferCount) external {
        require(publicKey.length > 0, "Mark3dCollection: empty public key");
        TransferInfo storage info = transfers[tokenId];
        require(info.initiator != address(0), "Mark3dCollection: transfer for this token wasn't created");
        require(info.to == _msgSender(), "Mark3dCollection: permission denied");
        require(info.publicKey.length == 0, "Mark3dCollection: public key was already set");
        require(transferCount == transferCounts[tokenId], "Mark3dCollection: transfer count doesn't match");
        info.publicKey = publicKey;
        info.publicKeySetAt = block.timestamp;
        emit TransferPublicKeySet(tokenId, publicKey);
    }

    /**
     * @dev See {IEncryptedFileToken-approveTransfer}.
     */
    function approveTransfer(uint256 tokenId, bytes calldata encryptedPassword) external {
        require(encryptedPassword.length > 0, "Mark3dCollection: empty password");
        TransferInfo storage info = transfers[tokenId];
        require(info.initiator != address(0), "Mark3dCollection: transfer for this token wasn't created");
        require(ownerOf(tokenId) == _msgSender(), "Mark3dCollection: permission denied");
        require(info.publicKey.length != 0, "Mark3dCollection: public key wasn't set yet");
        require(info.encryptedPassword.length == 0, "Mark3dCollection: encrypted password was already set");
        info.encryptedPassword = encryptedPassword;
        info.passwordSetAt = block.timestamp;
        emit TransferPasswordSet(tokenId, encryptedPassword);
    }

    /**
     * @dev See {IEncryptedFileToken-finalizeTransfer}.
     */
    function finalizeTransfer(uint256 tokenId) external {
        TransferInfo storage info = transfers[tokenId];
        require(info.initiator != address(0), "Mark3dCollection: transfer for this token wasn't created");
        require(info.encryptedPassword.length != 0, "Mark3dCollection: encrypted password wasn't set yet");
        require(!info.fraudReported, "Mark3dCollection: fraud was reported");
        require(info.to == _msgSender() ||
            (info.passwordSetAt + 24 hours < block.timestamp && info.from == _msgSender()), "Mark3dCollection: permission denied");
        _safeTransfer(ownerOf(tokenId), info.to, tokenId, info.data);
        if (address(info.callbackReceiver) != address(0)) {
            info.callbackReceiver.transferFinished(tokenId);
        }
        delete transfers[tokenId];
        emit TransferFinished(tokenId);
    }

    /**
     * @dev See {IEncryptedFileToken-reportFraud}.
     */
    function reportFraud(
        uint256 tokenId,
        bytes calldata privateKey
    ) external {
        require(privateKey.length > 0, "Mark3dCollection: private key is empty");
        TransferInfo storage info = transfers[tokenId];
        require(info.initiator != address(0), "Mark3dCollection: transfer for this token wasn't created");
        require(info.to == _msgSender(), "Mark3dCollection: permission denied");
        require(info.encryptedPassword.length != 0, "Mark3dCollection: encrypted password wasn't set yet");
        require(!info.fraudReported, "Mark3dCollection: fraud was already reported");

        info.fraudReported = true;
        (bool decided, bool approve) = fraudDecider_.decide(tokenId,
            tokenUris[tokenId], info.publicKey, privateKey, info.encryptedPassword);
        require(fraudLateDecisionEnabled || decided, "Mark3dCollection: late decision disabled");
        emit TransferFraudReported(tokenId);

        if (decided) {
            if (address(info.callbackReceiver) != address(0)) {
                info.callbackReceiver.transferFraudDetected(tokenId, approve);
            }
            if (approve) {
                _safeTransfer(ownerOf(tokenId), info.to, tokenId, info.data);
            }
            delete transfers[tokenId];
            emit TransferFraudDecided(tokenId, approve);
        }
    }

    /**
     * @dev See {IEncryptedFileToken-applyFraudDecision}.
     */
    function applyFraudDecision(
        uint256 tokenId,
        bool approve
    ) external {
        require(fraudLateDecisionEnabled, "Mark3dCollection: late decision disabled");
        TransferInfo storage info = transfers[tokenId];
        require(info.initiator != address(0), "Mark3dCollection: transfer for this token wasn't created");
        require(_msgSender() == address(fraudDecider_), "Mark3dCollection: permission denied");
        require(info.fraudReported, "Mark3dCollection: fraud was not reported");
        if (address(info.callbackReceiver) != address(0)) {
            info.callbackReceiver.transferFraudDetected(tokenId, approve);
        }
        bytes memory data = info.data;
        address to = info.to;
        delete transfers[tokenId];
        if (!approve) {
            _safeTransfer(ownerOf(tokenId), to, tokenId, data);
        }

        emit TransferFraudDecided(tokenId, approve);
    }

    /**
     * @dev See {IEncryptedFileToken-cancelTransfer}.
     */
    function cancelTransfer(
        uint256 tokenId
    ) external {
        TransferInfo storage info = transfers[tokenId];
        require(info.initiator != address(0), "Mark3dCollection: transfer for this token wasn't created");
        require(!info.fraudReported, "Mark3dCollection: fraud reported");
        require(_msgSender() == ownerOf(tokenId) || (info.to == address(0) && _msgSender() == info.initiator) ||
            (info.publicKeySetAt + 24 hours < block.timestamp && info.passwordSetAt == 0 && info.to == _msgSender()),
            "Mark3dCollection: permission denied");
        if (address(info.callbackReceiver) != address(0)) {
            info.callbackReceiver.transferCancelled(tokenId);
        }
        delete transfers[tokenId];
        emit TransferCancellation(tokenId);
    }

    /// @dev function for transferring minting rights for collection
    function transferOwnership(address to) public virtual override onlyAccessToken {
        _transferOwnership(to);
    }

    function safeTransferFrom(address, address, uint256,
        bytes memory) public virtual override(ERC721Upgradeable, IERC721Upgradeable, IEncryptedFileTokenUpgradeable) {
        revert("common transfer disabled");
    }

    function safeTransferFrom(address, address,
        uint256) public virtual override(ERC721Upgradeable, IERC721Upgradeable, IEncryptedFileTokenUpgradeable) {
        revert("common transfer disabled");
    }

    function transferFrom(address, address,
        uint256) public virtual override(ERC721Upgradeable, IERC721Upgradeable, IEncryptedFileTokenUpgradeable) {
        revert("common transfer disabled");
    }

    /// @dev mint function for using in inherited contracts
    /// @param to - token receiver
    /// @param id - token id
    /// @param metaUri - metadata uri
    /// @param data - additional token data
    function _mint(address to, uint256 id, string memory metaUri, bytes memory data) internal {
        require(id == tokensCount, "Mark3dCollection: wrong id");
        tokensCount++;
        _safeMint(to, id);
        tokenUris[id] = metaUri;
        tokenData[id] = data;
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._afterTokenTransfer(from, to, tokenId);
        accessToken.updateCollectionIndex(from, to, accessTokenId);
    }
}
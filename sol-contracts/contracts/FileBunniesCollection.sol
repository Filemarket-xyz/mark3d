// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "./IFraudDecider.sol";
import "./IEncryptedFileToken.sol";
import "./IEncryptedFileTokenUpgradeable.sol";
import "./IEncryptedFileTokenCallbackReceiver.sol";

contract FileBunniesCollection is IEncryptedFileToken, ERC721Enumerable, AccessControl, IERC2981 {
    using ECDSA for bytes32;

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
        IEncryptedFileTokenCallbackReceiver callbackReceiver;   // callback receiver
        bytes data;                                             // transfer data
        bytes publicKey;                                        // public key of receiver
        bytes encryptedPassword;                                // encrypted password
        bool fraudReported;                                     // if fraud reported while finalizing transfer
        uint256 publicKeySetAt;                                 // public key set at
        uint256 passwordSetAt;                                  // password set at
        bytes32 blockHash;
    }

    error StartIdExceedsCurrentLength();
    error ExceedsLimitByRarity();

    uint256 public constant PERCENT_MULTIPLIER = 10000;
    bytes32 public constant COMMON_WHITELIST_APPROVER_ROLE = keccak256("COMMON_WHITELIST_APPROVER");
    bytes32 public constant UNCOMMON_WHITELIST_APPROVER_ROLE = keccak256("UNCOMMON_WHITELIST_APPROVER");
    uint256 public constant ROYALTY_CEILING = PERCENT_MULTIPLIER / 2;  // 50%
    uint256 public constant TOKENS_LIMIT           = 10000;        // mint limit
    uint256 public constant COMMON_TOKENS_LIMIT   = 6000;         // free mint common tokens limit
    uint256 public constant UNCOMMON_TOKENS_LIMIT = 1000;         // free mint uncommon tokens limit
    uint256 public constant PAYED_TOKENS_LIMIT    = 3000;         // payed mint limit
    uint256 public constant FREE_MINT_LIMIT = COMMON_TOKENS_LIMIT + UNCOMMON_TOKENS_LIMIT;
    address public commonWhitelistApprover;
    address public uncommonWhitelistApprover;
    string[] public commonCids;
    string[] public uncommonCids;
    string[] public payedCids;

    mapping(uint256 => uint256) public royalties;             // mapping of token to royalty
    address public royaltyReceiver;

    bytes public collectionData;                               // collection additional data
    string private contractMetaUri;                            // contract-level metadata
    mapping(uint256 => string) public tokenUris;               // mapping of token metadata uri
    mapping(uint256 => bytes) public tokenData;                // mapping of token additional data
    uint256 public tokensCount;                                // count of minted tokens
    uint256 public commonTokensCount;                          // count of free minted common tokens
    uint256 public uncommonTokensCount;                        // count of free minted uncommon tokens
    uint256 public payedTokensCount;                           // count of minted tokens
    mapping(uint256 => TransferInfo) private transfers;        // transfer details
    mapping(uint256 => uint256) public transferCounts;         // count of transfers per transfer
    bool private fraudLateDecisionEnabled;                     // false if fraud decision is instant
    IFraudDecider private fraudDecider_;                       // fraud decider
    uint256 public finalizeTransferTimeout;                    // Time before transfer finalizes automatically
    uint256 private salesStartTimestamp;                       // Time when users can start transfer tokens
    uint256 private freeTokensSalesStartTimestamp;             // Time when users can start transfer free minted tokens
    uint256 private nonce = 0;

    constructor(
        string memory name,
        string memory symbol,
        string memory _contractMetaUri,
        address _admin,
        address _commonWhitelistApprover,
        address _uncommonWhitelistApprover,
        address _royaltyReciever,
        bytes memory _data,
        IFraudDecider _fraudDecider,
        bool _fraudLateDecisionEnabled
    ) ERC721(name, symbol) {
        tokensCount = 0;
        commonTokensCount = 0;
        uncommonTokensCount = 0;
        payedTokensCount = 0;

        royaltyReceiver = _royaltyReciever;

        contractMetaUri = _contractMetaUri;
        collectionData = _data;
        fraudDecider_ = _fraudDecider;
        fraudLateDecisionEnabled = _fraudLateDecisionEnabled;
        finalizeTransferTimeout = 24 hours;
        salesStartTimestamp = block.timestamp - 1 minutes;
        freeTokensSalesStartTimestamp = block.timestamp - 1 minutes;

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(COMMON_WHITELIST_APPROVER_ROLE, _commonWhitelistApprover);
        commonWhitelistApprover = _commonWhitelistApprover;
        _grantRole(UNCOMMON_WHITELIST_APPROVER_ROLE, _uncommonWhitelistApprover);
        uncommonWhitelistApprover = _uncommonWhitelistApprover;
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Enumerable, IERC165, AccessControl) returns (bool) {
        return interfaceId == type(IEncryptedFileToken).interfaceId ||
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
        uint256 royalty,
        bytes memory _data
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(bytes(metaUri).length > 0, "FileBunniesCollection: empty meta uri");
        require(id < TOKENS_LIMIT, "FileBunniesCollection: limit reached");
        _mint(to, id, metaUri, royalty, _data);
    }

    /// @dev Mint batch of tokens without metaUri. Can called only by the owner
    /// @param to - tokens receiver
    /// @param startId - tokenId of the first token to mint
    /// @param count - tokens quantity to mint
    /// @param _data - additional token data list
    function mintBatchWithoutMeta(address to, uint256 startId, uint256 count, uint256 royalty, bytes[] memory _data) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(startId + count-1 < TOKENS_LIMIT, "FileBunniesCollection: number of tokens exceeds TOKENS_LIMIT");
        require(count == _data.length, "FileBunniesCollection: _data list length must be equal to count");
        uint256 id = startId;
        for (uint256 i = 0; i < count; i++) {
            require(!_exists(id), "FileBunniesCollection: token is already minted");
            _mint(to, id, "", royalty, _data[i]);
            id++;
        }
    }

    /// @dev burn function
    /// @param id - token id
    function burn(uint256 id) external {
        require(ownerOf(id) == _msgSender(), "FileBunniesCollection: not an owner of token");
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
        require(_isApprovedOrOwner(_msgSender(), tokenId), "FileBunniesCollection: caller is not token owner or approved");
        require(transfers[tokenId].initiator == address(0), "FileBunniesCollection: transfer for this token was already created");
        transfers[tokenId] = TransferInfo(tokenId, _msgSender(), _msgSender(), to,
            callbackReceiver, data, bytes(""), bytes(""), false, 0, 0, 0);
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
        require(_isApprovedOrOwner(_msgSender(), tokenId), "FileBunniesCollection: caller is not token owner or approved");
        require(transfers[tokenId].initiator == address(0), "FileBunniesCollection: transfer for this token was already created");
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()) || block.timestamp > salesStartTimestamp, "FileBunniesCollection: transfer can't be done before sales start day");
        require(tokenId >= FREE_MINT_LIMIT || hasRole(DEFAULT_ADMIN_ROLE, _msgSender()) || block.timestamp > freeTokensSalesStartTimestamp, "FileBunniesCollection: transfer can't be done before sales start day");
        transfers[tokenId] = TransferInfo(tokenId, _msgSender(), ownerOf(tokenId), address(0),
            callbackReceiver, bytes(""), bytes(""), bytes(""), false, 0, 0, 0);
        transferCounts[tokenId]++;

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
        require(publicKey.length > 0, "FileBunniesCollection: empty public key");
        TransferInfo storage info = transfers[tokenId];
        require(info.initiator != address(0), "FileBunniesCollection: transfer for this token wasn't created");
        require(_msgSender() == info.initiator, "FileBunniesCollection: permission denied");
        require(info.to == address(0), "FileBunniesCollection: draft already complete");

        info.to = to;
        info.data = data;
        info.publicKey = publicKey;
        info.publicKeySetAt = block.timestamp;
        info.blockHash = blockhash(block.number-1);

        // initial purchase
        if (bytes(tokenUris[tokenId]).length == 0) {
            if (tokenId < FREE_MINT_LIMIT) {
                require(data.length != 0, "Signiture wasn't provided");
                address signer = uncommonWhitelistApprover;
                if (tokenId < COMMON_TOKENS_LIMIT) {
                    signer = commonWhitelistApprover;
                }
                bytes32 address_bytes = bytes32(uint256(uint160(to)));
                require(address_bytes.toEthSignedMessageHash().recover(data) == signer, "FileBunniesCollection: whitelist invalid signature");
            }
            attachRandomCid(tokenId, info);
        }

        emit TransferDraftCompletion(tokenId, to);
        emit TransferPublicKeySet(tokenId, publicKey);
    }

    /**
     * @dev See {IEncryptedFileToken-setTransferPublicKey}.
     */
    function setTransferPublicKey(uint256 tokenId, bytes calldata publicKey, uint256 transferNumber) external {
        require(publicKey.length > 0, "FileBunniesCollection: empty public key");
        TransferInfo storage info = transfers[tokenId];
        require(info.initiator != address(0), "FileBunniesCollection: transfer for this token wasn't created");
        require(info.to == _msgSender(), "FileBunniesCollection: permission denied");
        require(info.publicKey.length == 0, "FileBunniesCollection: public key was already set");
        require(transferNumber == transferCounts[tokenId], "FileBunniesCollection: the transfer is not the latest transfer of this token");
        info.publicKey = publicKey;
        info.publicKeySetAt = block.timestamp;
        emit TransferPublicKeySet(tokenId, publicKey);
    }

    /**
     * @dev See {IEncryptedFileToken-approveTransfer}.
     */
    function approveTransfer(uint256 tokenId, bytes calldata encryptedPassword) external {
        require(encryptedPassword.length > 0, "FileBunniesCollection: empty password");
        TransferInfo storage info = transfers[tokenId];
        require(info.initiator != address(0), "FileBunniesCollection: transfer for this token wasn't created");
        require(ownerOf(tokenId) == _msgSender(), "FileBunniesCollection: permission denied");
        require(info.publicKey.length != 0, "FileBunniesCollection: public key wasn't set yet");
        require(info.encryptedPassword.length == 0, "FileBunniesCollection: encrypted password was already set");
        info.encryptedPassword = encryptedPassword;
        info.passwordSetAt = block.timestamp;
        emit TransferPasswordSet(tokenId, encryptedPassword);
    }

    /**
     * @dev See {IEncryptedFileToken-finalizeTransfer}.
     */
    function finalizeTransfer(uint256 tokenId) external {
        TransferInfo storage info = transfers[tokenId];
        require(info.initiator != address(0), "FileBunniesCollection: transfer for this token wasn't created");
        require(info.encryptedPassword.length != 0, "FileBunniesCollection: encrypted password wasn't set yet");
        require(!info.fraudReported, "FileBunniesCollection: fraud was reported");
        require(info.to == _msgSender() ||
            (info.passwordSetAt + finalizeTransferTimeout < block.timestamp && info.from == _msgSender()), "FileBunniesCollection: permission denied");
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
        require(privateKey.length > 0, "FileBunniesCollection: private key is empty");
        TransferInfo storage info = transfers[tokenId];
        require(info.initiator != address(0), "FileBunniesCollection: transfer for this token wasn't created");
        require(info.to == _msgSender(), "FileBunniesCollection: permission denied");
        require(info.encryptedPassword.length != 0, "FileBunniesCollection: encrypted password wasn't set yet");
        require(!info.fraudReported, "FileBunniesCollection: fraud was already reported");

        info.fraudReported = true;
        (bool decided, bool approve) = fraudDecider_.decide(tokenId,
            tokenUris[tokenId], info.publicKey, privateKey, info.encryptedPassword);
        require(fraudLateDecisionEnabled || decided, "FileBunniesCollection: late decision disabled");
        emit TransferFraudReported(tokenId);

        if (decided) {
            if (address(info.callbackReceiver) != address(0)) {
                info.callbackReceiver.transferFraudDetected(tokenId, approve);
            }
            if (!approve) {
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
        require(fraudLateDecisionEnabled, "FileBunniesCollection: late decision disabled");
        TransferInfo storage info = transfers[tokenId];
        require(info.initiator != address(0), "FileBunniesCollection: transfer for this token wasn't created");
        require(_msgSender() == address(fraudDecider_), "FileBunniesCollection: permission denied");
        require(info.fraudReported, "FileBunniesCollection: fraud was not reported");
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
        require(info.initiator != address(0), "FileBunniesCollection: transfer for this token wasn't created");
        require(!info.fraudReported, "FileBunniesCollection: fraud reported");
        require(_msgSender() == ownerOf(tokenId) || (info.to == address(0) && _msgSender() == info.initiator) ||
            (info.publicKeySetAt + finalizeTransferTimeout < block.timestamp && info.passwordSetAt == 0 && info.to == _msgSender()),
            "FileBunniesCollection: permission denied");
        if (address(info.callbackReceiver) != address(0)) {
            info.callbackReceiver.transferCancelled(tokenId);
        }
        delete transfers[tokenId];
        emit TransferCancellation(tokenId);
    }

    function safeTransferFrom(address, address, uint256,
        bytes memory) public virtual override(ERC721, IERC721, IEncryptedFileToken) {
        revert("common transfer disabled");
    }

    function safeTransferFrom(address, address,
        uint256) public virtual override(ERC721, IERC721, IEncryptedFileToken) {
        revert("common transfer disabled");
    }

    function transferFrom(address, address,
        uint256) public virtual override(ERC721, IERC721, IEncryptedFileToken) {
        revert("common transfer disabled");
    }

    function setFinalizeTransferTimeout(uint256 newTimeout) external onlyRole(DEFAULT_ADMIN_ROLE) {
        finalizeTransferTimeout = newTimeout;
    }

    function setSalesStartTimestamp(uint256 newTimestamp) external onlyRole(DEFAULT_ADMIN_ROLE) {
        salesStartTimestamp = newTimestamp;
    }

    function setFreeTokensSalesStartTimestamp(uint256 newTimestamp) external onlyRole(DEFAULT_ADMIN_ROLE) {
        freeTokensSalesStartTimestamp = newTimestamp;
    }

    /// @dev mint function for using in inherited contracts
    /// @param to - token receiver
    /// @param id - token id
    /// @param metaUri - metadata uri
    /// @param data - additional token data
    function _mint(address to, uint256 id, string memory metaUri, uint256 royalty, bytes memory data) internal {
        require(royalty <= ROYALTY_CEILING, "FileBunniesCollection: royalty is too high");
        if (id < COMMON_TOKENS_LIMIT) {
            require(commonTokensCount + 1 <= COMMON_TOKENS_LIMIT, "FileBunniesCollection: out of limit");
            commonTokensCount++;
        } else if (id < FREE_MINT_LIMIT) {
            require(uncommonTokensCount + 1 <= UNCOMMON_TOKENS_LIMIT, "FileBunniesCollection: out of limit");
            uncommonTokensCount++;
        } else {
            require(payedTokensCount + 1 <= PAYED_TOKENS_LIMIT, "FileBunniesCollection: out of limit");
            payedTokensCount++;
        }
        tokensCount++;
        _safeMint(to, id);
        tokenUris[id] = metaUri;
        tokenData[id] = data;
        royalties[id] = royalty;
    }

    function prng(uint256 mod, uint256 blockTimestamp, bytes32 blockHash, bytes32 blockHash2, bytes32 address_bytes, bytes32 signature, uint256 n) private view returns(uint256) {
        bytes32 hash = keccak256(abi.encodePacked(blockTimestamp, blockHash, address_bytes));
        hash = keccak256(abi.encodePacked(blockHash2, signature, n, block.prevrandao, hash));
        return uint256(hash) % mod;
    }

    // id range [0, 6000)
    function addCommonCids(uint256 startTokenId, string[] calldata cids) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 count = cids.length;
        uint256 startId = startTokenId;

        if (startId > commonCids.length) revert StartIdExceedsCurrentLength();
        if (startId + count > COMMON_TOKENS_LIMIT) revert ExceedsLimitByRarity();

        // extend array if necessary
        for (uint i = commonCids.length; i < startId + count; i++) {
            commonCids.push("");
        }

        for (uint i = 0; i < count; i++) {
            commonCids[startId + i] = cids[i];
        }
    }

    // id range [6000, 7000)
    function addUncommonCids(uint256 startTokenId, string[] calldata cids) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 count = cids.length;
        uint256 startId = startTokenId - COMMON_TOKENS_LIMIT;

        if (startId > uncommonCids.length) revert StartIdExceedsCurrentLength();
        if (startId + count > UNCOMMON_TOKENS_LIMIT) revert ExceedsLimitByRarity();

        // extend array if necessary
        for (uint i = uncommonCids.length; i < startId + count; i++) {
            uncommonCids.push("");
        }

        for (uint i = 0; i < count; i++) {
            uncommonCids[startId + i] = cids[i];
        }
    }

    // id range [7000, 10000)
    function addPayedCids(uint256 startTokenId, string[] calldata cids) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 count = cids.length;
        uint256 startId = PAYED_TOKENS_LIMIT + startTokenId - TOKENS_LIMIT;

        if (startId > payedCids.length) revert StartIdExceedsCurrentLength();
        if (startId + count > PAYED_TOKENS_LIMIT) revert ExceedsLimitByRarity();

        // extend array if necessary
        for (uint i = payedCids.length; i < startId + count; i++) {
            payedCids.push("");
        }

        for (uint i = 0; i < count; i++) {
            payedCids[startId + i] = cids[i];
        }
    }

    function setRoyaltyReceiver(address newAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
        royaltyReceiver = newAddress;
    }

    function royaltyInfo(uint256 tokenId, uint256 salePrice) public view override returns (address receiver, uint256 royaltyAmount) {
        require(_exists(tokenId), "ERC2981Royalties: Token does not exist");
        royaltyAmount = (salePrice * royalties[tokenId]) / PERCENT_MULTIPLIER;
        return (royaltyReceiver, royaltyAmount);
    }

    function attachRandomCid(uint256 tokenId, TransferInfo memory info) internal {
        string[] storage cidArray;
        bytes32 signature = bytes32(info.data);
        bytes32 address_bytes = bytes32(uint256(uint160(info.to)));

        if (tokenId < COMMON_TOKENS_LIMIT) {
            cidArray = commonCids;
        } else if (tokenId < FREE_MINT_LIMIT) {
            cidArray = uncommonCids;
        } else {
            cidArray = payedCids;
            signature = bytes32("0LvQvtCx0LDQvdC+0LI=");
        }
        require(cidArray.length > 0, "FileBunniedCollection: cid array is empty");
        uint256 cidId = prng(cidArray.length,
                                info.publicKeySetAt,
                                info.blockHash,
                                blockhash(block.number - 1),
                                address_bytes,
                                signature,
                                nonce
        );
        nonce++;

        tokenUris[tokenId] = string.concat("ipfs://", cidArray[cidId]);
        cidArray[cidId] = cidArray[cidArray.length-1];
        cidArray.pop();
    }
}
package service

import (
	"context"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/mark3d-xyz/mark3d/indexer/contracts/publicCollection"
	"github.com/mark3d-xyz/mark3d/indexer/pkg/retry"
	"io"
	"log"
	"math/big"
	"net/http"
	"strings"
	"time"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/go-redis/redis/v8"
	"github.com/jackc/pgx/v4"
	"github.com/mark3d-xyz/mark3d/indexer/contracts/access_token"
	"github.com/mark3d-xyz/mark3d/indexer/contracts/collection"
	"github.com/mark3d-xyz/mark3d/indexer/contracts/exchange"
	"github.com/mark3d-xyz/mark3d/indexer/internal/config"
	"github.com/mark3d-xyz/mark3d/indexer/internal/domain"
	"github.com/mark3d-xyz/mark3d/indexer/internal/repository"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	ethclient2 "github.com/mark3d-xyz/mark3d/indexer/pkg/ethclient"
	healthnotifier "github.com/mark3d-xyz/mark3d/indexer/pkg/health_notifier"
	"github.com/mark3d-xyz/mark3d/indexer/pkg/now"
)

var (
	ErrSubFailed = errors.New("sub failed")
)

const (
	zeroAddress = "0x0000000000000000000000000000000000000000"
)

type Service interface {
	Collections
	Tokens
	Transfers
	Orders
	ListenBlockchain() error
	Shutdown()

	HealthCheck(context.Context) (*models.HealthStatusResponse, *models.ErrorResponse)
}

type EthClient interface {
	ethereum.ChainReader
	bind.ContractBackend
	ethereum.TransactionReader
}

type Collections interface {
	GetCollection(ctx context.Context, address common.Address) (*models.Collection, *models.ErrorResponse)
	GetCollectionWithTokens(ctx context.Context, address common.Address) (*models.CollectionData, *models.ErrorResponse)
}

type Tokens interface {
	GetToken(ctx context.Context, address common.Address, tokenId *big.Int) (*models.Token, *models.ErrorResponse)
	GetTokenEncryptedPassword(ctx context.Context, address common.Address, tokenId *big.Int) (*models.EncryptedPasswordResponse, *models.ErrorResponse)
	GetCollectionTokens(ctx context.Context, address common.Address) ([]*models.Token, *models.ErrorResponse)
	GetTokensByAddress(ctx context.Context, address common.Address) (*models.TokensResponse, *models.ErrorResponse)
}

type Transfers interface {
	GetTransfers(ctx context.Context, address common.Address) (*models.TransfersResponse, *models.ErrorResponse)
	GetTransfersHistory(ctx context.Context, address common.Address) (*models.TransfersResponse, *models.ErrorResponse)
	GetTransfer(ctx context.Context, address common.Address, tokenId *big.Int) (*models.Transfer, *models.ErrorResponse)
	GetTransfersV2(ctx context.Context, address common.Address) (*models.TransfersResponseV2, *models.ErrorResponse)
	GetTransfersHistoryV2(ctx context.Context, address common.Address) (*models.TransfersResponseV2, *models.ErrorResponse)
	GetTransferV2(ctx context.Context, address common.Address, tokenId *big.Int) (*models.TransferWithData, *models.ErrorResponse)
}

type Orders interface {
	GetOrders(ctx context.Context, address common.Address) (*models.OrdersResponse, *models.ErrorResponse)
	GetOrdersHistory(ctx context.Context, address common.Address) (*models.OrdersResponse, *models.ErrorResponse)
	GetOrder(ctx context.Context, address common.Address, tokenId *big.Int) (*models.Order, *models.ErrorResponse)
	GetAllActiveOrders(ctx context.Context) ([]*models.OrderWithToken, *models.ErrorResponse)
}

type service struct {
	repository          repository.Repository
	healthNotifier      healthnotifier.HealthNotifyer
	cfg                 *config.ServiceConfig
	ethClient           ethclient2.EthClient
	accessTokenAddress  common.Address
	accessTokenInstance *access_token.Mark3dAccessToken
	exchangeAddress     common.Address
	exchangeInstance    *exchange.Mark3dExchange
	closeCh             chan struct{}
}

func NewService(
	repo repository.Repository,
	ethClient ethclient2.EthClient,
	healthNotifier healthnotifier.HealthNotifyer,
	cfg *config.ServiceConfig,
) (Service, error) {
	accessTokenInstance, err := access_token.NewMark3dAccessToken(cfg.AccessTokenAddress, nil)
	if err != nil {
		return nil, err
	}

	exchangeInstance, err := exchange.NewMark3dExchange(cfg.ExchangeAddress, nil)
	if err != nil {
		return nil, err
	}

	return &service{
		ethClient:           ethClient,
		repository:          repo,
		healthNotifier:      healthNotifier,
		cfg:                 cfg,
		accessTokenAddress:  cfg.AccessTokenAddress,
		accessTokenInstance: accessTokenInstance,
		exchangeAddress:     cfg.ExchangeAddress,
		exchangeInstance:    exchangeInstance,
		closeCh:             make(chan struct{}),
	}, nil
}

func (s *service) HealthCheck(ctx context.Context) (*models.HealthStatusResponse, *models.ErrorResponse) {
	lastBlockNumber, err := s.repository.GetLastBlock(ctx)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    500,
			Detail:  err.Error(),
			Message: "Failed to get last block in indexer",
		}
	}
	headBlockNumber, err := s.ethClient.GetLatestBlockNumber(ctx)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    500,
			Detail:  err.Error(),
			Message: "Failed to get head block from blockchain",
		}
	}

	status := models.HealthStatusHealthy
	backlog := big.NewInt(0).Sub(headBlockNumber, lastBlockNumber).Int64()
	if backlog < 0 {
		return nil, &models.ErrorResponse{
			Code:    500,
			Detail:  fmt.Sprintf("Somehow headBlockNumber - lastBlockNumber = %d", backlog),
			Message: "Head block number is smaller than our last block number",
		}
	}
	if backlog > s.cfg.AllowedBlockNumberDifference {
		status = models.HealthStatusUnhealthy
	}

	return &models.HealthStatusResponse{
		Status:       status,
		BlockBacklog: backlog,
	}, nil
}

func (s *service) tokenURI(ctx context.Context,
	blockNum, tokenId *big.Int) (string, error) {

	defer func(start time.Time) {
		log.Println("token uri time", now.Now().Sub(start).Milliseconds())
	}(now.Now())

	var err error
	for _, cli := range s.ethClient.Clients() {
		var instance *access_token.Mark3dAccessToken

		instance, err = access_token.NewMark3dAccessToken(s.accessTokenAddress, cli)
		if err != nil {
			return "", err
		}
		var metaUri string
		metaUri, err = instance.TokenURI(&bind.CallOpts{
			BlockNumber: blockNum,
			Context:     ctx,
		}, tokenId)
		if err != nil {
			log.Println("token uri access token failed", tokenId, err)
		} else if metaUri == "" {
			log.Println("token uri access token empty", tokenId)
		} else {
			return metaUri, nil
		}
	}
	if err == nil {
		return "", fmt.Errorf("empty metadata")
	}
	return "", err
}

func (s *service) collectionTokenURI(ctx context.Context,
	address common.Address, tokenId *big.Int) (string, error) {
	var err error
	for _, cli := range s.ethClient.Clients() {
		var instance *collection.Mark3dCollection

		instance, err = collection.NewMark3dCollection(address, cli)
		if err != nil {
			return "", err
		}
		var metaUri string
		metaUri, err = instance.TokenURI(
			&bind.CallOpts{Context: ctx},
			tokenId,
		)
		if err != nil {
			log.Println("token uri collection failed", address, tokenId, err)
		} else if metaUri == "" {
			log.Println("token uri collection empty", address, tokenId)
		} else {
			return metaUri, nil
		}
	}
	if err == nil {
		return "", fmt.Errorf("empty metadata")
	}
	return "", err
}

func (s *service) getExchangeOrder(
	ctx context.Context,
	blockNum *big.Int,
	collectionAddress common.Address,
	tokenId *big.Int,
) (struct {
	Token     common.Address
	TokenId   *big.Int
	Price     *big.Int
	Initiator common.Address
	Receiver  common.Address
	Fulfilled bool
}, error) {
	var err error
	for _, cli := range s.ethClient.Clients() {
		var exchangeInstance *exchange.Mark3dExchange

		exchangeInstance, err = exchange.NewMark3dExchange(s.exchangeAddress, cli)
		if err != nil {
			return struct {
				Token     common.Address
				TokenId   *big.Int
				Price     *big.Int
				Initiator common.Address
				Receiver  common.Address
				Fulfilled bool
			}{}, err
		}
		var order struct {
			Token     common.Address
			TokenId   *big.Int
			Price     *big.Int
			Initiator common.Address
			Receiver  common.Address
			Fulfilled bool
		}
		order, err = exchangeInstance.Orders(&bind.CallOpts{
			Context:     ctx,
			BlockNumber: blockNum,
		}, collectionAddress, tokenId)
		if err != nil {
			log.Println("get exchange order failed", collectionAddress, tokenId, err)
		} else if order.Token == common.HexToAddress(zeroAddress) {
			err = errors.New("empty collection address")
			log.Println("get exchange order empty", collectionAddress, tokenId)
		} else {
			return order, nil
		}
	}
	if err == nil {
		err = fmt.Errorf("empty order")
	}
	return struct {
		Token     common.Address
		TokenId   *big.Int
		Price     *big.Int
		Initiator common.Address
		Receiver  common.Address
		Fulfilled bool
	}{}, err
}

func (s *service) isCollection(ctx context.Context, tx pgx.Tx, address common.Address) (bool, error) {
	if address == s.cfg.PublicCollectionAddress {
		return true, nil
	}
	_, err := s.repository.GetCollection(ctx, tx, address)
	if err != nil {
		if err == pgx.ErrNoRows {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

func (s *service) loadTokenParams(ctx context.Context, cid string) (domain.TokenMetadata, error) {
	cid = strings.TrimPrefix(cid, "ipfs://")
	if cid == "" {
		return domain.TokenMetadata{}, errors.New("empty cid")
	}
	ctx, cancel := context.WithTimeout(ctx, 20*time.Second)
	defer cancel()
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, fmt.Sprintf("https://gateway.lighthouse.storage/ipfs/%s", cid), nil)
	if err != nil {
		return domain.TokenMetadata{}, errors.New("failed to create request")
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return domain.TokenMetadata{}, errors.New("failed to execute request")
	}
	defer resp.Body.Close()
	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return domain.TokenMetadata{}, err
	}

	var meta domain.TokenMetadataIpfs
	if err := json.Unmarshal(data, &meta); err != nil {
		return domain.TokenMetadata{}, err
	}
	return domain.IpfsMetadataToDomain(meta), nil
}

func (s *service) processCollectionCreation(
	ctx context.Context,
	tx pgx.Tx,
	t *types.Transaction,
	blockNumber uint64,
	ev *access_token.Mark3dAccessTokenCollectionCreation,
) error {
	from, err := types.Sender(types.LatestSignerForChainID(t.ChainId()), t)
	if err != nil {
		return err
	}

	c := domain.Collection{
		Address: ev.Instance,
		Creator: from,
		Owner:   from,
		TokenId: ev.TokenId,
	}

	// Get token metadata
	backoff := &retry.ExponentialBackoff{
		InitialInterval: 3,
		RandFactor:      0.5,
		Multiplier:      2,
		MaxInterval:     10,
	}

	metaUriRetryOpts := retry.Options{
		Fn: func(ctx context.Context, args ...any) (any, error) {
			blockNum, bnOk := args[0].(*big.Int)
			tokenId, tiOk := args[1].(*big.Int)

			if !bnOk || !tiOk {
				return "", fmt.Errorf("wrong Fn arguments: %w", retry.UnretryableErr)
			}
			return s.tokenURI(ctx, blockNum, tokenId)
		},
		FnArgs: []any{
			big.NewInt(0).SetUint64(blockNumber),
			ev.TokenId,
		},
		RetryOnAnyError: true,
		Backoff:         backoff,
		MaxElapsedTime:  30 * time.Second,
	}

	metaUriAny, err := retry.OnErrors(ctx, metaUriRetryOpts)
	if err != nil {
		var failedErr *retry.FailedErr
		if errors.As(err, &failedErr) {
			log.Printf("failed to get metadataUri: %v", failedErr)
		} else {
			return err
		}
	}

	meta := domain.NewPlaceholderMetadata()
	metaUri, ok := metaUriAny.(string)
	if !ok {
		return errors.New("failed to cast metaUri to string")
	}

	if metaUri != "" {
		loadMetaRetryOpts := retry.Options{
			Fn: func(ctx context.Context, args ...any) (any, error) {
				uri, ok := args[0].(string)
				if !ok {
					return "", fmt.Errorf("wrong Fn arguments: %w", retry.UnretryableErr)
				}
				return s.loadTokenParams(ctx, uri)
			},
			FnArgs:          []any{metaUri},
			RetryOnAnyError: true,
			Backoff:         backoff,
			MaxElapsedTime:  30 * time.Second,
		}

		metaAny, err := retry.OnErrors(ctx, loadMetaRetryOpts)
		if err != nil {
			var failedErr *retry.FailedErr
			if errors.As(err, &failedErr) {
				log.Printf("failed to load metadata: %v", failedErr)
			} else {
				return fmt.Errorf("failed to loadTokenParams: %w", err)
			}
		}
		meta, ok = metaAny.(domain.TokenMetadata)
		if !ok {
			return errors.New("failed to cast to Metadata")
		}
	}

	c.MetaUri = metaUri
	c.Name = meta.Name
	c.Description = meta.Description
	c.Image = meta.Image

	if err := s.repository.InsertCollection(ctx, tx, &c); err != nil {
		return err
	}
	if err := s.repository.InsertCollectionTransfer(ctx, tx, ev.Instance, &domain.CollectionTransfer{
		Timestamp: now.Now().UnixMilli(),
		From:      common.HexToAddress(zeroAddress),
		To:        from,
		TxId:      t.Hash(),
	}); err != nil {
		return err
	}
	log.Println("collection created", ev.Instance)
	return nil
}

func (s *service) processCollectionTransfer(ctx context.Context, tx pgx.Tx,
	t *types.Transaction, ev *access_token.Mark3dAccessTokenTransfer) error {
	c, err := s.repository.GetCollectionsByTokenId(ctx, tx, ev.TokenId)
	if err != nil {
		return err
	}
	exists, err := s.repository.CollectionTransferExists(ctx, tx, strings.ToLower(t.Hash().String()))
	if err != nil {
		return err
	}
	if exists {
		return nil
	}
	c.Owner = ev.To
	if err := s.repository.UpdateCollection(ctx, tx, c); err != nil {
		return err
	}
	if err := s.repository.InsertCollectionTransfer(ctx, tx, c.Address, &domain.CollectionTransfer{
		Timestamp: now.Now().UnixMilli(),
		From:      ev.From,
		To:        ev.To,
		TxId:      t.Hash(),
	}); err != nil {
		return err
	}
	log.Println("collection transfer processed", c.Address.String(), ev.From.String(), ev.To.String(), t.Hash().String())
	return nil
}

func (s *service) processAccessTokenTx(ctx context.Context, tx pgx.Tx, t *types.Transaction) error {
	start := now.Now()
	receipt, err := s.ethClient.TransactionReceipt(ctx, t.Hash())
	if err != nil {
		return err
	}
	log.Println("receipt time", now.Now().Sub(start).Milliseconds())
	for _, l := range receipt.Logs {
		creation, err := s.accessTokenInstance.ParseCollectionCreation(*l)
		if err != nil {
			transfer, err := s.accessTokenInstance.ParseTransfer(*l)
			if err != nil {
				continue
			}
			if transfer.From == common.HexToAddress(zeroAddress) {
				continue
			}
			if err := s.processCollectionTransfer(ctx, tx, t, transfer); err != nil {
				return err
			}
			continue
		}
		_, err = s.repository.GetCollection(ctx, tx, common.HexToAddress(creation.Instance.Hex()))
		if err == nil {
			continue
		}
		if err != nil && err != pgx.ErrNoRows {
			return err
		}
		if err := s.processCollectionCreation(ctx, tx, t, l.BlockNumber, creation); err != nil {
			return err
		}
	}
	log.Println("access token process time", now.Now().Sub(start).Milliseconds())
	return nil
}

func (s *service) tryProcessCollectionTransferEvent(
	ctx context.Context,
	tx pgx.Tx,
	instance *collection.Mark3dCollection,
	t *types.Transaction,
	l *types.Log,
	blockNumber *big.Int,
) error {
	transfer, err := instance.ParseTransfer(*l)
	if err != nil {
		return nil
	}
	if transfer.From != common.HexToAddress(zeroAddress) {
		return nil
	}
	block, err := s.ethClient.BlockByNumber(ctx, blockNumber)
	if err != nil {
		return nil
	}

	if err := s.onCollectionTransferEvent(ctx, tx, t, l, block, transfer.TokenId, transfer.To); err != nil {
		return err
	}
	return nil
}

func (s *service) tryProcessPublicCollectionTransferEvent(
	ctx context.Context,
	tx pgx.Tx,
	instance *publicCollection.PublicCollection,
	t *types.Transaction,
	l *types.Log,
	blockNumber *big.Int,
) error {
	transfer, err := instance.ParseTransfer(*l)
	if err != nil {
		return nil
	}
	if transfer.From != common.HexToAddress(zeroAddress) {
		return nil
	}
	block, err := s.ethClient.BlockByNumber(ctx, blockNumber)
	if err != nil {
		return nil
	}

	if err := s.onCollectionTransferEvent(ctx, tx, t, l, block, transfer.TokenId, transfer.To); err != nil {
		return err
	}
	return nil
}

func (s *service) tryProcessTransferInit(
	ctx context.Context,
	tx pgx.Tx,
	instance *collection.Mark3dCollection,
	t *types.Transaction,
	l *types.Log,
) error {
	initEv, err := instance.ParseTransferInit(*l)
	if err != nil {
		return nil
	}
	if err := s.onCollectionTransferInitEvent(ctx, tx, t, l, initEv.TokenId, initEv.From, initEv.To, initEv.TransferNumber); err != nil {
		return err
	}
	return nil
}

func (s *service) tryProcessPublicCollectionTransferInit(
	ctx context.Context,
	tx pgx.Tx,
	instance *publicCollection.PublicCollection,
	t *types.Transaction,
	l *types.Log,
) error {
	initEv, err := instance.ParseTransferInit(*l)
	if err != nil {
		return nil
	}
	if err := s.onCollectionTransferInitEvent(ctx, tx, t, l, initEv.TokenId, initEv.From, initEv.To, initEv.TransferNumber); err != nil {
		return err
	}
	return nil
}

func (s *service) tryProcessPublicCollectionTransferDraft(
	ctx context.Context,
	tx pgx.Tx,
	instance *publicCollection.PublicCollection,
	t *types.Transaction,
	l *types.Log,
) error {
	initEv, err := instance.ParseTransferDraft(*l)
	if err != nil {
		return nil
	}
	if err := s.onTransferDraftEvent(ctx, tx, t, l, initEv.TokenId, initEv.From, initEv.TransferNumber); err != nil {
		return err
	}
	return nil
}

func (s *service) tryProcessTransferDraft(
	ctx context.Context,
	tx pgx.Tx,
	instance *collection.Mark3dCollection,
	t *types.Transaction,
	l *types.Log,
) error {
	initEv, err := instance.ParseTransferDraft(*l)
	if err != nil {
		return nil
	}
	if err := s.onTransferDraftEvent(ctx, tx, t, l, initEv.TokenId, initEv.From, initEv.TransferNumber); err != nil {
		return err
	}
	return nil
}

func (s *service) tryProcessPublicCollectionTransferDraftCompletion(
	ctx context.Context,
	tx pgx.Tx,
	instance *publicCollection.PublicCollection,
	t *types.Transaction,
	l *types.Log,
) error {
	ev, err := instance.ParseTransferDraftCompletion(*l)
	if err != nil {
		return nil
	}
	if err := s.onTransferDraftCompletionEvent(ctx, tx, t, l, ev.TokenId, ev.To); err != nil {
		return err
	}
	return nil
}

func (s *service) tryProcessTransferDraftCompletion(
	ctx context.Context,
	tx pgx.Tx,
	instance *collection.Mark3dCollection,
	t *types.Transaction,
	l *types.Log,
) error {
	ev, err := instance.ParseTransferDraftCompletion(*l)
	if err != nil {
		return nil
	}
	if err := s.onTransferDraftCompletionEvent(ctx, tx, t, l, ev.TokenId, ev.To); err != nil {
		return err
	}
	return nil
}

func (s *service) tryProcessPublicCollectionPublicKeySet(
	ctx context.Context,
	tx pgx.Tx,
	instance *publicCollection.PublicCollection,
	t *types.Transaction,
	l *types.Log,
) error {
	ev, err := instance.ParseTransferPublicKeySet(*l)
	if err != nil {
		return nil
	}
	if err := s.onPublicKeySetEvent(ctx, tx, t, l, ev.TokenId, hex.EncodeToString(ev.PublicKey)); err != nil {
		return err
	}
	return nil
}

func (s *service) tryProcessPublicKeySet(
	ctx context.Context,
	tx pgx.Tx,
	instance *collection.Mark3dCollection,
	t *types.Transaction,
	l *types.Log,
) error {
	ev, err := instance.ParseTransferPublicKeySet(*l)
	if err != nil {
		return nil
	}
	if err := s.onPublicKeySetEvent(ctx, tx, t, l, ev.TokenId, hex.EncodeToString(ev.PublicKey)); err != nil {
		return err
	}
	return nil
}

func (s *service) tryProcessPublicCollectionPasswordSet(
	ctx context.Context,
	tx pgx.Tx,
	instance *publicCollection.PublicCollection,
	t *types.Transaction,
	l *types.Log,
) error {
	ev, err := instance.ParseTransferPasswordSet(*l)
	if err != nil {
		return nil
	}
	if err := s.onPasswordSetEvent(ctx, tx, t, l, ev.TokenId, hex.EncodeToString(ev.EncryptedPassword)); err != nil {
		return err
	}
	return nil
}

func (s *service) tryProcessPasswordSet(
	ctx context.Context,
	tx pgx.Tx,
	instance *collection.Mark3dCollection,
	t *types.Transaction,
	l *types.Log,
) error {
	ev, err := instance.ParseTransferPasswordSet(*l)
	if err != nil {
		return nil
	}
	if err := s.onPasswordSetEvent(ctx, tx, t, l, ev.TokenId, hex.EncodeToString(ev.EncryptedPassword)); err != nil {
		return err
	}
	return nil
}

func (s *service) tryProcessPublicCollectionTransferFinish(
	ctx context.Context,
	tx pgx.Tx,
	instance *publicCollection.PublicCollection,
	t *types.Transaction,
	l *types.Log,
) error {
	ev, err := instance.ParseTransferFinished(*l)
	if err != nil {
		return nil
	}
	if err := s.onTransferFinishEvent(ctx, tx, t, l, ev.TokenId); err != nil {
		return err
	}
	return nil
}

func (s *service) tryProcessTransferFinish(
	ctx context.Context,
	tx pgx.Tx,
	instance *collection.Mark3dCollection,
	t *types.Transaction,
	l *types.Log,
) error {
	ev, err := instance.ParseTransferFinished(*l)
	if err != nil {
		return nil
	}
	if err := s.onTransferFinishEvent(ctx, tx, t, l, ev.TokenId); err != nil {
		return err
	}
	return nil
}

func (s *service) tryProcessPublicCollectionTransferFraudReported(
	ctx context.Context,
	tx pgx.Tx,
	instance *publicCollection.PublicCollection,
	t *types.Transaction,
	l *types.Log,
) error {
	ev, err := instance.ParseTransferFraudReported(*l)
	if err != nil {
		return nil
	}
	if err := s.onTransferFraudReportedEvent(ctx, tx, t, l, ev.TokenId); err != nil {
		return err
	}
	return nil
}

func (s *service) tryProcessTransferFraudReported(
	ctx context.Context,
	tx pgx.Tx,
	instance *collection.Mark3dCollection,
	t *types.Transaction,
	l *types.Log,
) error {
	ev, err := instance.ParseTransferFraudReported(*l)
	if err != nil {
		return nil
	}
	if err := s.onTransferFraudReportedEvent(ctx, tx, t, l, ev.TokenId); err != nil {
		return err
	}
	return nil
}

func (s *service) tryProcessPublicCollectionTransferFraudDecided(
	ctx context.Context,
	tx pgx.Tx,
	instance *publicCollection.PublicCollection,
	t *types.Transaction,
	l *types.Log,
) error {
	ev, err := instance.ParseTransferFraudDecided(*l)
	if err != nil {
		return nil
	}
	if err := s.onTransferFraudDecidedEvent(ctx, tx, t, l, ev.TokenId, ev.Approved); err != nil {
		return err
	}
	return nil
}

func (s *service) tryProcessTransferFraudDecided(
	ctx context.Context,
	tx pgx.Tx,
	instance *collection.Mark3dCollection,
	t *types.Transaction,
	l *types.Log,
) error {
	ev, err := instance.ParseTransferFraudDecided(*l)
	if err != nil {
		return nil
	}
	if err := s.onTransferFraudDecidedEvent(ctx, tx, t, l, ev.TokenId, ev.Approved); err != nil {
		return err
	}
	return nil
}

func (s *service) tryProcessPublicCollectionTransferCancel(
	ctx context.Context,
	tx pgx.Tx,
	instance *publicCollection.PublicCollection,
	t *types.Transaction,
	l *types.Log,
) error {
	ev, err := instance.ParseTransferCancellation(*l)
	if err != nil {
		return nil
	}
	if err := s.onTransferCancel(ctx, tx, t, l, ev.TokenId); err != nil {
		return err
	}
	return nil
}

func (s *service) tryProcessTransferCancel(
	ctx context.Context,
	tx pgx.Tx,
	instance *collection.Mark3dCollection,
	t *types.Transaction,
	l *types.Log,
) error {
	ev, err := instance.ParseTransferCancellation(*l)
	if err != nil {
		return nil
	}
	if err := s.onTransferCancel(ctx, tx, t, l, ev.TokenId); err != nil {
		return err
	}
	return nil
}

func (s *service) processCollectionTx(ctx context.Context, tx pgx.Tx, t *types.Transaction) error {
	log.Println("processing collection tx", t.Hash())
	receipt, err := s.ethClient.TransactionReceipt(ctx, t.Hash())
	if err != nil {
		return err
	}

	for _, l := range receipt.Logs {
		instance, instanceErr := collection.NewMark3dCollection(l.Address, nil)
		if instanceErr == nil {
			err := s.processFileMarketCollectionEvents(ctx, tx, t, l, instance, receipt.BlockNumber)
			if err != nil {
				return err
			}
		}

		instance2, instance2Err := publicCollection.NewPublicCollection(l.Address, nil)
		if instance2Err == nil {
			err := s.processPublicCollectionEvents(ctx, tx, t, l, instance2, receipt.BlockNumber)
			if err != nil {
				return err
			}
		}
		if instanceErr != nil && instance2Err != nil {
			return errors.Join(instanceErr, instance2Err)
		}
	}
	return nil
}

func (s *service) processPublicCollectionEvents(ctx context.Context, tx pgx.Tx, t *types.Transaction, l *types.Log, instance *publicCollection.PublicCollection, blockNumber *big.Int) error {
	if err := s.tryProcessPublicCollectionTransferEvent(ctx, tx, instance, t, l, blockNumber); err != nil {
		return fmt.Errorf("process public collection transfer: %w", err)
	}
	if err := s.tryProcessPublicCollectionTransferInit(ctx, tx, instance, t, l); err != nil {
		return fmt.Errorf("process public collection transfer init: %w", err)
	}
	if err := s.tryProcessPublicCollectionTransferDraft(ctx, tx, instance, t, l); err != nil {
		return fmt.Errorf("process public collection transfer draft: %w", err)
	}
	if err := s.tryProcessPublicCollectionTransferDraftCompletion(ctx, tx, instance, t, l); err != nil {
		return fmt.Errorf("process public collection draft completion: %w", err)
	}
	if err := s.tryProcessPublicCollectionPublicKeySet(ctx, tx, instance, t, l); err != nil {
		return fmt.Errorf("process public collection public key set: %w", err)
	}
	if err := s.tryProcessPublicCollectionPasswordSet(ctx, tx, instance, t, l); err != nil {
		return fmt.Errorf("process public collection password set: %w", err)
	}
	if err := s.tryProcessPublicCollectionTransferFinish(ctx, tx, instance, t, l); err != nil {
		return fmt.Errorf("process public collection transfer finish: %w", err)
	}
	if err := s.tryProcessPublicCollectionTransferFraudReported(ctx, tx, instance, t, l); err != nil {
		return fmt.Errorf("process public collection fraud reported: %w", err)
	}
	if err := s.tryProcessPublicCollectionTransferFraudDecided(ctx, tx, instance, t, l); err != nil {
		return fmt.Errorf("process public collection fraud decided: %w", err)
	}
	if err := s.tryProcessPublicCollectionTransferCancel(ctx, tx, instance, t, l); err != nil {
		return fmt.Errorf("process transfer cancel: %w", err)
	}
	return nil
}

func (s *service) processFileMarketCollectionEvents(ctx context.Context, tx pgx.Tx, t *types.Transaction, l *types.Log, instance *collection.Mark3dCollection, blockNumber *big.Int) error {
	if err := s.tryProcessCollectionTransferEvent(ctx, tx, instance, t, l, blockNumber); err != nil {
		return fmt.Errorf("process collection transfer: %w", err)
	}
	if err := s.tryProcessTransferInit(ctx, tx, instance, t, l); err != nil {
		return fmt.Errorf("process transfer init: %w", err)
	}
	if err := s.tryProcessTransferDraft(ctx, tx, instance, t, l); err != nil {
		return fmt.Errorf("process transfer draft: %w", err)
	}
	if err := s.tryProcessTransferDraftCompletion(ctx, tx, instance, t, l); err != nil {
		return fmt.Errorf("process draft completion: %w", err)
	}
	if err := s.tryProcessPublicKeySet(ctx, tx, instance, t, l); err != nil {
		return fmt.Errorf("process public key set: %w", err)
	}
	if err := s.tryProcessPasswordSet(ctx, tx, instance, t, l); err != nil {
		return fmt.Errorf("process password set: %w", err)
	}
	if err := s.tryProcessTransferFinish(ctx, tx, instance, t, l); err != nil {
		return fmt.Errorf("process transfer finish: %w", err)
	}
	if err := s.tryProcessTransferFraudReported(ctx, tx, instance, t, l); err != nil {
		return fmt.Errorf("process fraud reported: %w", err)
	}
	if err := s.tryProcessTransferFraudDecided(ctx, tx, instance, t, l); err != nil {
		return fmt.Errorf("process fraud decided: %w", err)
	}
	if err := s.tryProcessTransferCancel(ctx, tx, instance, t, l); err != nil {
		return fmt.Errorf("process transfer cancel: %w", err)
	}
	return nil
}

func (s *service) processBlock(block *types.Block) error {
	ctx, cancel := context.WithTimeout(context.Background(), 600*time.Second)
	defer cancel()
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		return err
	}
	defer tx.Rollback(context.Background())
	for _, t := range block.Transactions() {
		if t.To() == nil {
			continue
		}
		isCollectionAddress, err := s.isCollection(ctx, tx, *t.To())
		if err != nil {
			return err
		}
		if *t.To() == s.cfg.AccessTokenAddress {
			err = s.processAccessTokenTx(ctx, tx, t)
		} else if *t.To() == s.cfg.ExchangeAddress {
			err = s.processCollectionTx(ctx, tx, t)
		} else if *t.To() == s.cfg.FraudDeciderWeb2Address {
			err = s.processCollectionTx(ctx, tx, t)
		} else if isCollectionAddress {
			err = s.processCollectionTx(ctx, tx, t)
		}
		if err != nil {
			return err
		}
	}
	if err := tx.Commit(ctx); err != nil {
		return err
	}
	return nil
}

func (s *service) ListenBlockchain() error {
	lastBlock, err := s.repository.GetLastBlock(context.Background())
	if err != nil {
		if err == redis.Nil {
			blockNum, err := s.ethClient.GetLatestBlockNumber(context.Background())
			if err != nil {
				return err
			}
			lastBlock = blockNum
		} else {
			return err
		}
	}

	lastNotificationTime := time.Now().Add(-1 * time.Hour)
	for {
		select {
		case <-time.After(time.Second):
			current, err := s.checkBlock(lastBlock)
			if err != nil {
				err = fmt.Errorf("process block failed: %w", err)
				log.Println(err)

				// Send telegram notification if at least 120 seconds passed since last notification
				elapsedTime := time.Now().Sub(lastNotificationTime)
				if elapsedTime >= 120*time.Second {
					err := s.healthNotifier.Notify(context.Background(), fmt.Sprintf("ListenBlockchain %s: %s", s.cfg.Mode, err.Error()))
					if err != nil {
						log.Printf("Failed to send error notification %v", err)
					}
				}
			}
			lastBlock = current
		case <-s.closeCh:
			return nil
		}
	}
}

func (s *service) checkBlock(latest *big.Int) (*big.Int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	blockNum, err := s.ethClient.GetLatestBlockNumber(ctx)
	if err != nil {
		log.Println("get latest block failed", err)
		return latest, err
	}
	if blockNum.Cmp(latest) != 0 {
		log.Println("processing block difference", latest, blockNum)
	}
	for blockNum.Cmp(latest) != 0 {
		latest, err = s.checkSingleBlock(latest)
		if err != nil {
			return latest, err
		}
	}
	return latest, nil
}

func (s *service) checkSingleBlock(latest *big.Int) (*big.Int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	pending := big.NewInt(0).Add(latest, big.NewInt(1))
	block, err := s.ethClient.BlockByNumber(ctx, pending)
	if err != nil {
		log.Println("get pending block failed", pending.String(), err)
		if !strings.Contains(err.Error(), "want 512 for Bloom") && !strings.Contains(err.Error(), "requested epoch was a null round") {
			return latest, err
		}
	} else {
		if err := s.processBlock(block); err != nil {
			log.Println("process block failed", err)
			return latest, err
		}
	}
	if err := s.repository.SetLastBlock(context.Background(), pending); err != nil {
		log.Println("set last block failed")
	}
	return pending, err
}

func (s *service) Shutdown() {
	s.closeCh <- struct{}{}
	close(s.closeCh)
}

package service

import (
	"context"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/jackc/pgx/v4"
	"github.com/mark3d-xyz/mark3d/indexer/contracts/access_token"
	"github.com/mark3d-xyz/mark3d/indexer/contracts/collection"
	"github.com/mark3d-xyz/mark3d/indexer/contracts/exchange"
	"github.com/mark3d-xyz/mark3d/indexer/internal/config"
	"github.com/mark3d-xyz/mark3d/indexer/internal/domain"
	"github.com/mark3d-xyz/mark3d/indexer/internal/postgres"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"github.com/mark3d-xyz/mark3d/indexer/pkg/now"
	"io"
	"log"
	"math/big"
	"net/http"
	"strings"
	"time"
)

var (
	ErrSubFailed = errors.New("sub failed")
)

const (
	zeroAddress = "0x0000000000000000000000000000000000000000"
)

type metaData struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Image       string `json:"image"`
	HiddenFile  string `json:"hidden_file"`
}

type Service interface {
	Collections
	Tokens
	Transfers
	Orders
	ListenBlockchain() error
	Shutdown()
}

type EthClient interface {
	ethereum.ChainReader
	bind.ContractBackend
	ethereum.TransactionReader
}

type Collections interface {
	GetCollection(ctx context.Context, address common.Address) (*models.Collection, *models.ErrorResponse)
}

type Tokens interface {
	GetToken(ctx context.Context, address common.Address, tokenId *big.Int) (*models.Token, *models.ErrorResponse)
	GetCollectionTokens(ctx context.Context, address common.Address) ([]*models.Token, *models.ErrorResponse)
	GetTokensByAddress(ctx context.Context, address common.Address) (*models.TokensResponse, *models.ErrorResponse)
}

type Transfers interface {
	GetTransfers(ctx context.Context, address common.Address) (*models.TransfersResponse, *models.ErrorResponse)
	GetTransfersHistory(ctx context.Context, address common.Address) (*models.TransfersResponse, *models.ErrorResponse)
	GetTransfer(ctx context.Context, address common.Address, tokenId *big.Int) (*models.Transfer, *models.ErrorResponse)
}

type Orders interface {
	GetOrders(ctx context.Context, address common.Address) (*models.OrdersResponse, *models.ErrorResponse)
	GetOrdersHistory(ctx context.Context, address common.Address) (*models.OrdersResponse, *models.ErrorResponse)
	GetOrder(ctx context.Context, address common.Address, tokenId *big.Int) (*models.Order, *models.ErrorResponse)
}

type service struct {
	postgres            postgres.Postgres
	cfg                 *config.ServiceConfig
	ethClient           EthClient
	accessTokenInstance *access_token.Mark3dAccessToken
	exchangeInstance    *exchange.Mark3dExchange
	sub                 ethereum.Subscription
}

func NewService(postgres postgres.Postgres, ethClient EthClient, cfg *config.ServiceConfig) (Service, error) {
	accessTokenInstance, err := access_token.NewMark3dAccessToken(cfg.AccessTokenAddress, ethClient)
	if err != nil {
		return nil, err
	}
	exchangeInstance, err := exchange.NewMark3dExchange(cfg.ExchangeAddress, ethClient)
	if err != nil {
		return nil, err
	}
	return &service{
		ethClient:           ethClient,
		postgres:            postgres,
		cfg:                 cfg,
		accessTokenInstance: accessTokenInstance,
		exchangeInstance:    exchangeInstance,
	}, nil
}

func (s *service) isCollection(ctx context.Context, tx pgx.Tx, address common.Address) (bool, error) {
	_, err := s.postgres.GetCollection(ctx, tx, address)
	if err != nil {
		if err == pgx.ErrNoRows {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

func (s *service) loadTokenParams(ctx context.Context, cid string) metaData {
	cid = strings.TrimPrefix(cid, "ipfs://")
	if cid == "" {
		return metaData{}
	}
	ctx, cancel := context.WithTimeout(ctx, 20*time.Second)
	defer cancel()
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, fmt.Sprintf("https://nftstorage.link/ipfs/%s", cid), nil)
	if err != nil {
		return metaData{}
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return metaData{}
	}
	defer resp.Body.Close()
	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return metaData{}
	}
	var meta metaData
	if err := json.Unmarshal(data, &meta); err != nil {
		return metaData{}
	}
	return meta
}

func (s *service) processCollectionCreation(ctx context.Context, tx pgx.Tx,
	t *types.Transaction, ev *access_token.Mark3dAccessTokenCollectionCreation) error {
	from, err := types.Sender(types.LatestSignerForChainID(t.ChainId()), t)
	if err != nil {
		return err
	}
	metaUri, err := s.accessTokenInstance.TokenURI(&bind.CallOpts{
		Context: ctx,
	}, ev.TokenId)
	if err != nil {
		return err
	}
	meta := s.loadTokenParams(ctx, metaUri)
	if err := s.postgres.InsertCollection(ctx, tx, &domain.Collection{
		Address:     ev.Instance,
		Creator:     from,
		Owner:       from,
		TokenId:     ev.TokenId,
		MetaUri:     metaUri,
		Name:        meta.Name,
		Description: meta.Description,
		Image:       meta.Image,
	}); err != nil {
		return err
	}
	if err := s.postgres.InsertCollectionTransfer(ctx, tx, ev.Instance, &domain.CollectionTransfer{
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
	c, err := s.postgres.GetCollectionsByTokenId(ctx, tx, ev.TokenId)
	if err != nil {
		return err
	}
	c.Owner = ev.To
	if err := s.postgres.UpdateCollection(ctx, tx, c); err != nil {
		return err
	}
	if err := s.postgres.InsertCollectionTransfer(ctx, tx, c.Address, &domain.CollectionTransfer{
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
	receipt, err := s.ethClient.TransactionReceipt(ctx, t.Hash())
	if err != nil {
		return err
	}
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
		if err := s.processCollectionCreation(ctx, tx, t, creation); err != nil {
			return err
		}
	}
	return nil
}

func (s *service) tryProcessCollectionTransferEvent(ctx context.Context, tx pgx.Tx,
	instance *collection.Mark3dCollection, t *types.Transaction, l *types.Log) error {
	transfer, err := instance.ParseTransfer(*l)
	if err != nil {
		return nil
	}
	if transfer.From != common.HexToAddress(zeroAddress) {
		return nil
	}
	metaUri, err := instance.TokenURI(&bind.CallOpts{
		Context: ctx,
	}, transfer.TokenId)
	if err != nil {
		return err
	}
	meta := s.loadTokenParams(ctx, metaUri)
	token := &domain.Token{
		CollectionAddress: *t.To(),
		TokenId:           transfer.TokenId,
		Owner:             transfer.To,
		MetaUri:           metaUri,
		Name:              meta.Name,
		Description:       meta.Description,
		Image:             meta.Image,
		HiddenFile:        meta.HiddenFile,
		Creator:           transfer.To,
	}
	if err := s.postgres.InsertToken(ctx, tx, token); err != nil {
		return err
	}
	log.Println("token inserted", token.CollectionAddress.String(), token.TokenId.String(), token.Owner.String(),
		token.MetaUri, token.Description, token.Image, token.HiddenFile)
	return nil
}

func (s *service) tryProcessTransferInit(ctx context.Context, tx pgx.Tx,
	instance *collection.Mark3dCollection, t *types.Transaction, l *types.Log) error {
	initEv, err := instance.ParseTransferInit(*l)
	if err != nil {
		return nil
	}
	transfer := &domain.Transfer{
		CollectionAddress: *t.To(),
		TokenId:           initEv.TokenId,
		FromAddress:       initEv.From,
		ToAddress:         initEv.To,
	}
	id, err := s.postgres.InsertTransfer(ctx, tx, transfer)
	if err != nil {
		return err
	}
	transfer.Id = id
	if err := s.postgres.InsertTransferStatus(ctx, tx, id, &domain.TransferStatus{
		Timestamp: now.Now().UnixMilli(),
		Status:    string(models.TransferStatusCreated),
		TxId:      t.Hash(),
	}); err != nil {
		return err
	}
	return nil
}

func (s *service) tryProcessTransferDraft(ctx context.Context, tx pgx.Tx,
	instance *collection.Mark3dCollection, t *types.Transaction, l *types.Log) error {
	initEv, err := instance.ParseTransferDraft(*l)
	if err != nil {
		return nil
	}
	order, err := s.exchangeInstance.Orders(&bind.CallOpts{
		Context: ctx,
	}, l.Address, initEv.TokenId)
	if err != nil {
		return err
	}
	transfer := &domain.Transfer{
		CollectionAddress: l.Address,
		TokenId:           initEv.TokenId,
		FromAddress:       initEv.From,
	}
	id, err := s.postgres.InsertTransfer(ctx, tx, transfer)
	if err != nil {
		return err
	}
	transfer.Id = id
	timestamp := now.Now().UnixMilli()
	if err := s.postgres.InsertTransferStatus(ctx, tx, id, &domain.TransferStatus{
		Timestamp: now.Now().UnixMilli(),
		Status:    string(models.TransferStatusDrafted),
		TxId:      t.Hash(),
	}); err != nil {
		return err
	}
	o := &domain.Order{
		TransferId: id,
		Price:      order.Price,
	}
	orderId, err := s.postgres.InsertOrder(ctx, tx, o)
	if err != nil {
		return err
	}
	if err := s.postgres.InsertOrderStatus(ctx, tx, orderId, &domain.OrderStatus{
		Timestamp: timestamp,
		Status:    string(models.OrderStatusCreated),
		TxId:      t.Hash(),
	}); err != nil {
		return err
	}
	return nil
}

func (s *service) tryProcessTransferDraftCompletion(ctx context.Context, tx pgx.Tx,
	instance *collection.Mark3dCollection, t *types.Transaction, l *types.Log) error {
	ev, err := instance.ParseTransferDraftCompletion(*l)
	if err != nil {
		return nil
	}
	transfer, err := s.postgres.GetActiveTransfer(ctx, tx, l.Address, ev.TokenId)
	if err != nil {
		return err
	}
	order, err := s.postgres.GetOrder(ctx, tx, transfer.OrderId)
	if err != nil {
		return err
	}
	timestamp := now.Now().UnixMilli()
	transfer.ToAddress = ev.To
	if err := s.postgres.UpdateTransfer(ctx, tx, transfer); err != nil {
		return err
	}
	if err := s.postgres.InsertTransferStatus(ctx, tx, transfer.Id, &domain.TransferStatus{
		Timestamp: timestamp,
		Status:    string(models.TransferStatusCreated),
		TxId:      t.Hash(),
	}); err != nil {
		return err
	}
	if err := s.postgres.InsertOrderStatus(ctx, tx, order.Id, &domain.OrderStatus{
		Timestamp: timestamp,
		Status:    string(models.OrderStatusFulfilled),
		TxId:      t.Hash(),
	}); err != nil {
		return err
	}
	return nil
}

func (s *service) tryProcessPublicKeySet(ctx context.Context, tx pgx.Tx,
	instance *collection.Mark3dCollection, t *types.Transaction, l *types.Log) error {
	ev, err := instance.ParseTransferPublicKeySet(*l)
	if err != nil {
		return nil
	}
	transfer, err := s.postgres.GetActiveTransfer(ctx, tx, l.Address, ev.TokenId)
	if err != nil {
		return err
	}
	if err := s.postgres.InsertTransferStatus(ctx, tx, transfer.Id, &domain.TransferStatus{
		Timestamp: now.Now().UnixMilli(),
		Status:    string(models.TransferStatusPublicKeySet),
		TxId:      t.Hash(),
	}); err != nil {
		return err
	}
	transfer.PublicKey = hex.EncodeToString(ev.PublicKey)
	if err := s.postgres.UpdateTransfer(ctx, tx, transfer); err != nil {
		return err
	}
	return nil
}

func (s *service) tryProcessPasswordSet(ctx context.Context, tx pgx.Tx,
	instance *collection.Mark3dCollection, t *types.Transaction, l *types.Log) error {
	ev, err := instance.ParseTransferPasswordSet(*l)
	if err != nil {
		return nil
	}
	transfer, err := s.postgres.GetActiveTransfer(ctx, tx, l.Address, ev.TokenId)
	if err != nil {
		return err
	}
	if err := s.postgres.InsertTransferStatus(ctx, tx, transfer.Id, &domain.TransferStatus{
		Timestamp: now.Now().UnixMilli(),
		Status:    string(models.TransferStatusPasswordSet),
		TxId:      t.Hash(),
	}); err != nil {
		return err
	}
	transfer.EncryptedPassword = hex.EncodeToString(ev.EncryptedPassword)
	if err := s.postgres.UpdateTransfer(ctx, tx, transfer); err != nil {
		return err
	}
	return nil
}

func (s *service) tryProcessTransferFinish(ctx context.Context, tx pgx.Tx,
	instance *collection.Mark3dCollection, t *types.Transaction, l *types.Log) error {
	ev, err := instance.ParseTransferFinished(*l)
	if err != nil {
		return nil
	}
	transfer, err := s.postgres.GetActiveTransfer(ctx, tx, l.Address, ev.TokenId)
	if err != nil {
		return err
	}
	timestamp := now.Now().UnixMilli()
	if err := s.postgres.InsertTransferStatus(ctx, tx, transfer.Id, &domain.TransferStatus{
		Timestamp: timestamp,
		Status:    string(models.TransferStatusFinished),
		TxId:      t.Hash(),
	}); err != nil {
		return err
	}
	if transfer.OrderId != 0 {
		if err := s.postgres.InsertOrderStatus(ctx, tx, transfer.OrderId, &domain.OrderStatus{
			Timestamp: timestamp,
			Status:    string(models.OrderStatusFinished),
			TxId:      t.Hash(),
		}); err != nil {
			return err
		}
	}
	token, err := s.postgres.GetToken(ctx, tx, l.Address, ev.TokenId)
	if err != nil {
		return err
	}
	token.Owner = transfer.ToAddress
	if err := s.postgres.UpdateToken(ctx, tx, token); err != nil {
		return err
	}
	return nil
}

func (s *service) tryProcessTransferFraudReported(ctx context.Context, tx pgx.Tx,
	instance *collection.Mark3dCollection, t *types.Transaction, l *types.Log) error {
	ev, err := instance.ParseTransferFraudReported(*l)
	if err != nil {
		return nil
	}
	transfer, err := s.postgres.GetActiveTransfer(ctx, tx, l.Address, ev.TokenId)
	if err != nil {
		return err
	}
	timestamp := now.Now().UnixMilli()
	if err := s.postgres.InsertTransferStatus(ctx, tx, transfer.Id, &domain.TransferStatus{
		Timestamp: timestamp,
		Status:    string(models.TransferStatusFraudReported),
		TxId:      t.Hash(),
	}); err != nil {
		return err
	}
	return nil
}

func (s *service) tryProcessTransferFraudDecided(ctx context.Context, tx pgx.Tx,
	instance *collection.Mark3dCollection, t *types.Transaction, l *types.Log) error {
	ev, err := instance.ParseTransferFraudDecided(*l)
	if err != nil {
		return nil
	}
	transfer, err := s.postgres.GetActiveTransfer(ctx, tx, l.Address, ev.TokenId)
	if err != nil {
		return err
	}
	timestamp := now.Now().UnixMilli()
	if err := s.postgres.InsertTransferStatus(ctx, tx, transfer.Id, &domain.TransferStatus{
		Timestamp: timestamp,
		Status:    string(models.TransferStatusFinished),
		TxId:      t.Hash(),
	}); err != nil {
		return err
	}
	if transfer.OrderId != 0 {
		var orderStatus string
		if ev.Approved {
			orderStatus = string(models.OrderStatusFraudApproved)
		} else {
			orderStatus = string(models.OrderStatusFinished)
		}
		if err := s.postgres.InsertOrderStatus(ctx, tx, transfer.OrderId, &domain.OrderStatus{
			Timestamp: timestamp,
			Status:    orderStatus,
			TxId:      t.Hash(),
		}); err != nil {
			return err
		}
	}
	if ev.Approved {
		transfer.FraudApproved = true
		if err := s.postgres.UpdateTransfer(ctx, tx, transfer); err != nil {
			return err
		}
	} else {
		token, err := s.postgres.GetToken(ctx, tx, l.Address, ev.TokenId)
		if err != nil {
			return err
		}
		token.Owner = transfer.ToAddress
		if err := s.postgres.UpdateToken(ctx, tx, token); err != nil {
			return err
		}
	}
	return nil
}

func (s *service) tryProcessTransferCancel(ctx context.Context, tx pgx.Tx,
	instance *collection.Mark3dCollection, t *types.Transaction, l *types.Log) error {
	ev, err := instance.ParseTransferCancellation(*l)
	if err != nil {
		return nil
	}
	transfer, err := s.postgres.GetActiveTransfer(ctx, tx, l.Address, ev.TokenId)
	if err != nil {
		return err
	}
	timestamp := now.Now().UnixMilli()
	if err := s.postgres.InsertTransferStatus(ctx, tx, transfer.Id, &domain.TransferStatus{
		Timestamp: timestamp,
		Status:    string(models.TransferStatusCancelled),
		TxId:      t.Hash(),
	}); err != nil {
		return err
	}
	if transfer.OrderId != 0 {
		if err := s.postgres.InsertOrderStatus(ctx, tx, transfer.OrderId, &domain.OrderStatus{
			Timestamp: timestamp,
			Status:    string(models.OrderStatusCancelled),
			TxId:      t.Hash(),
		}); err != nil {
			return err
		}
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
		instance, err := collection.NewMark3dCollection(l.Address, s.ethClient)
		if err != nil {
			return err
		}
		if err := s.tryProcessCollectionTransferEvent(ctx, tx, instance, t, l); err != nil {
			return err
		}
		if err := s.tryProcessTransferInit(ctx, tx, instance, t, l); err != nil {
			return err
		}
		if err := s.tryProcessTransferDraft(ctx, tx, instance, t, l); err != nil {
			return err
		}
		if err := s.tryProcessTransferDraftCompletion(ctx, tx, instance, t, l); err != nil {
			return err
		}
		if err := s.tryProcessPublicKeySet(ctx, tx, instance, t, l); err != nil {
			return err
		}
		if err := s.tryProcessPasswordSet(ctx, tx, instance, t, l); err != nil {
			return err
		}
		if err := s.tryProcessTransferFinish(ctx, tx, instance, t, l); err != nil {
			return err
		}
		if err := s.tryProcessTransferFraudReported(ctx, tx, instance, t, l); err != nil {
			return err
		}
		if err := s.tryProcessTransferFraudDecided(ctx, tx, instance, t, l); err != nil {
			return err
		}
		if err := s.tryProcessTransferCancel(ctx, tx, instance, t, l); err != nil {
			return err
		}
	}
	return nil
}

func (s *service) processBlock(hash common.Hash) error {
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()
	block, err := s.ethClient.BlockByHash(ctx, hash)
	if err != nil {
		return err
	}
	tx, err := s.postgres.BeginTransaction(ctx, pgx.TxOptions{})
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
	ch := make(chan *types.Header, 5)
	sub, err := s.ethClient.SubscribeNewHead(context.Background(), ch)
	if err != nil {
		return err
	}
	s.sub = sub
	for {
		select {
		case head := <-ch:
			time.Sleep(100 * time.Millisecond)
			if err := s.processBlock(head.Hash()); err != nil {
				log.Println("process block failed", err)
			}
		case err := <-sub.Err():
			log.Println("listen blockchain: ", err)
			s.sub = nil
			return ErrSubFailed
		}
	}
}

func (s *service) Shutdown() {
	if s.sub != nil {
		s.sub.Unsubscribe()
	}
}

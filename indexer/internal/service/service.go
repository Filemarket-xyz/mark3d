package service

import (
	"context"
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

type Service interface {
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

type Tokens interface {
	GetTokensByAddress(ctx context.Context, address common.Address) (*models.TokensResponse, *models.ErrorResponse)
}

type Transfers interface {
	GetTransfers(ctx context.Context, address common.Address) (*models.TransfersResponse, *models.ErrorResponse)
	GetTransfersHistory(ctx context.Context, address common.Address) (*models.TransfersResponse, *models.ErrorResponse)
}

type Orders interface {
	GetOrders(ctx context.Context, address common.Address) (*models.OrdersResponse, *models.ErrorResponse)
	GetOrdersHistory(ctx context.Context, address common.Address) (*models.OrdersResponse, *models.ErrorResponse)
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

func (s *service) loadTokenName(ctx context.Context, cid string) string {
	cid = strings.TrimPrefix(cid, "ipfs://")
	if cid == "" {
		return ""
	}
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, fmt.Sprintf("https://ipfs.io/ipfs/%s", cid), nil)
	if err != nil {
		return ""
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return ""
	}
	defer resp.Body.Close()
	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return ""
	}
	var meta struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		Image       string `json:"image"`
	}
	if err := json.Unmarshal(data, &meta); err != nil {
		return ""
	}
	return meta.Name
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
	if err := s.postgres.InsertCollection(ctx, tx, &domain.Collection{
		Address: ev.Instance,
		Creator: from,
		Owner:   from,
		Name:    s.loadTokenName(ctx, metaUri),
		TokenId: ev.TokenId,
		MetaUri: metaUri,
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

func (s *service) processExchangeTx(ctx context.Context, tx pgx.Tx, t *types.Transaction) error {
	return nil
}

func (s *service) tryProcessCollectionTransferEvent(ctx context.Context, tx pgx.Tx,
	t *types.Transaction, l *types.Log) error {
	instance, err := collection.NewMark3dCollection(*t.To(), s.ethClient)
	if err != nil {
		return err
	}
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
	token := &domain.Token{
		CollectionAddress: *t.To(),
		TokenId:           transfer.TokenId,
		Owner:             transfer.To,
		MetaUri:           metaUri,
	}
	if err := s.postgres.InsertToken(ctx, tx, token); err != nil {
		return err
	}
	log.Println("token inserted", token.CollectionAddress.String(), token.TokenId.String(), token.Owner.String(), token.MetaUri)
	return nil
}

func (s *service) processCollectionTx(ctx context.Context, tx pgx.Tx, t *types.Transaction) error {
	receipt, err := s.ethClient.TransactionReceipt(ctx, t.Hash())
	if err != nil {
		return err
	}
	for _, l := range receipt.Logs {
		if err := s.tryProcessCollectionTransferEvent(ctx, tx, t, l); err != nil {
			return err
		}
	}
	return nil
}

func (s *service) processBlock(hash common.Hash) error {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
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
			err = s.processExchangeTx(ctx, tx, t)
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

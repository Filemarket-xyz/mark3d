package service

import (
	"context"
	"errors"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/jackc/pgx/v4"
	"github.com/mark3d-xyz/mark3d/indexer/internal/domain"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"github.com/mark3d-xyz/mark3d/indexer/pkg/now"
	"github.com/mark3d-xyz/mark3d/indexer/pkg/retry"
	"log"
	"math/big"
	"strings"
	"time"
)

func (s *service) onCollectionTransferEvent(
	ctx context.Context,
	tx pgx.Tx,
	t *types.Transaction,
	block *types.Block,
	tokenId *big.Int,
	to common.Address,
) error {
	collectionAddress := *t.To()
	token := &domain.Token{
		CollectionAddress: collectionAddress,
		TokenId:           tokenId,
		Owner:             to,
		Creator:           to,
		MintTxTimestamp:   block.Time(),
		MintTxHash:        t.Hash(),
	}

	// Get token metadata
	meta, metaUri, err := s.processMetadata(ctx, token)
	if err != nil {
		return err
	}
	royalty, err := processRoyalty(ctx, s, block, token)
	if err != nil {
		return err
	}
	token.Metadata = meta
	token.MetaUri = metaUri
	token.Royalty = royalty.Uint64()

	if err := s.repository.InsertToken(ctx, tx, token); err != nil {
		return err
	}
	log.Println("token inserted", token.CollectionAddress.String(), token.TokenId.String(), token.Owner.String(),
		token.MetaUri, token.Metadata)

	// Deleting token from sequencer
	// NOTE: file bunnies tokens got deleted from sequencer only after TransferDraftCompletion
	if token.CollectionAddress == s.cfg.PublicCollectionAddress {
		if err := s.sequencer.DeleteTokenID(ctx, strings.ToLower(token.CollectionAddress.String()), token.TokenId.Int64()); err != nil {
			log.Printf("failed deleting token from sequencer. Address: %s. TokendId: %s. Error: %v", token.CollectionAddress.String(), token.TokenId.String(), err)
		}
	}
	return nil
}

func processRoyalty(ctx context.Context, s *service, block *types.Block, token *domain.Token) (*big.Int, error) {
	royaltyRetryOpts := retry.Options{
		Fn: func(ctx context.Context, args ...any) (any, error) {
			collectionAddress, caOk := args[0].(common.Address)
			tokenId, tiOk := args[1].(*big.Int)
			blockNumber, bOk := args[2].(*big.Int)

			if !caOk || !tiOk || !bOk {
				return "", fmt.Errorf("wrong Fn arguments: %w", retry.UnretryableErr)
			}
			return s.getRoyalty(ctx, collectionAddress, tokenId, blockNumber)
		},
		FnArgs:          []any{token.CollectionAddress, token.TokenId, block.Number()},
		RetryOnAnyError: true,
		Backoff: &retry.ExponentialBackoff{
			InitialInterval: 3 * time.Second,
			RandFactor:      0.5,
			Multiplier:      2,
			MaxInterval:     10 * time.Second,
		},
		MaxElapsedTime: 30 * time.Second,
	}

	royaltyAny, err := retry.OnErrors(ctx, royaltyRetryOpts)
	if err != nil {
		var failedErr *retry.FailedErr
		if errors.As(err, &failedErr) {
			log.Printf("failed to load royalty: %v", failedErr)
		} else {
			return nil, fmt.Errorf("failed to getRoyalty: %w", err)
		}
	}

	royalty, ok := royaltyAny.(*big.Int)
	if !ok {
		return nil, errors.New("failed to cast royalty to *big.Int")
	}
	return royalty, nil
}

func (s *service) processMetadata(ctx context.Context, token *domain.Token) (*domain.TokenMetadata, string, error) {
	metaUriRetryOpts := retry.Options{
		Fn: func(ctx context.Context, args ...any) (any, error) {
			collectionAddress, caOk := args[0].(common.Address)
			tokenId, tiOk := args[1].(*big.Int)

			if !caOk || !tiOk {
				return "", fmt.Errorf("wrong Fn arguments: %w", retry.UnretryableErr)
			}
			return s.collectionTokenURI(ctx, collectionAddress, tokenId)
		},
		FnArgs:          []any{token.CollectionAddress, token.TokenId},
		RetryOnAnyError: true,
		Backoff: &retry.ExponentialBackoff{
			InitialInterval: 3 * time.Second,
			RandFactor:      0.5,
			Multiplier:      2,
			MaxInterval:     10 * time.Second,
		},
		MaxElapsedTime: 30 * time.Second,
	}

	metaUriAny, err := retry.OnErrors(ctx, metaUriRetryOpts)
	if err != nil {
		var failedErr *retry.FailedErr
		if errors.As(err, &failedErr) {
			log.Printf("failed to get metadataUri: %v", failedErr)
			return domain.NewPlaceholderMetadata(), "", nil
		} else {
			return nil, "", err
		}
	}

	metaUri, ok := metaUriAny.(string)
	if !ok {
		return nil, "", errors.New("failed to cast metaUri to string")
	}

	if token.CollectionAddress == s.cfg.FileBunniesCollectionAddress && metaUri == "" {
		// file bunnies do not have metaUri til TransferDraftCompleted
		return nil, "", nil
	}

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
		Backoff: &retry.ExponentialBackoff{
			InitialInterval: 3 * time.Second,
			RandFactor:      0.5,
			Multiplier:      2,
			MaxInterval:     10 * time.Second,
		},
		MaxElapsedTime: 30 * time.Second,
	}

	metaAny, err := retry.OnErrors(ctx, loadMetaRetryOpts)
	if err != nil {
		var failedErr *retry.FailedErr
		if errors.As(err, &failedErr) {
			log.Printf("failed to load metadata: %v", failedErr)
			return domain.NewPlaceholderMetadata(), metaUri, nil
		} else {
			return nil, metaUri, fmt.Errorf("failed to loadTokenParams: %w", err)
		}
	}

	meta, ok := metaAny.(domain.TokenMetadata)
	if !ok {
		return nil, metaUri, errors.New("failed to cast to Metadata")
	}

	return &meta, metaUri, nil
}

func (s *service) onCollectionTransferInitEvent(
	ctx context.Context,
	tx pgx.Tx,
	t *types.Transaction,
	l *types.Log,
	tokenId *big.Int,
	from common.Address,
	to common.Address,
	transferNumber *big.Int,
) error {
	exists, err := s.repository.TransferTxExists(ctx, tx, tokenId, t.Hash(), string(models.TransferStatusCreated))
	if err != nil {
		return err
	}
	if exists {
		return nil
	}
	_, err = s.repository.GetToken(ctx, tx, l.Address, tokenId)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil
		}
		return err
	}
	transfer := &domain.Transfer{
		CollectionAddress: *t.To(),
		TokenId:           tokenId,
		FromAddress:       from,
		ToAddress:         to,
		Number:            transferNumber,
	}
	id, err := s.repository.InsertTransfer(ctx, tx, transfer)
	if err != nil {
		return err
	}
	transfer.Id = id
	if err := s.repository.InsertTransferStatus(ctx, tx, id, &domain.TransferStatus{
		Timestamp: now.Now().UnixMilli(),
		Status:    string(models.TransferStatusCreated),
		TxId:      t.Hash(),
	}); err != nil {
		return err
	}
	return nil
}

func (s *service) onTransferDraftEvent(
	ctx context.Context,
	tx pgx.Tx,
	t *types.Transaction,
	l *types.Log,
	tokenId *big.Int,
	from common.Address,
	transferNumber *big.Int,
) error {
	exists, err := s.repository.TransferTxExists(ctx, tx, tokenId, t.Hash(), string(models.TransferStatusDrafted))
	if err != nil {
		return err
	}
	if exists {
		return nil
	}
	_, err = s.repository.GetToken(ctx, tx, l.Address, tokenId)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil
		}
		return err
	}

	backoff := &retry.ExponentialBackoff{
		InitialInterval: 3,
		RandFactor:      0.5,
		Multiplier:      2,
		MaxInterval:     10,
	}

	getOrderRetryOpts := retry.Options{
		Fn: func(ctx context.Context, args ...any) (any, error) {
			blockNum, bnOk := args[0].(*big.Int)
			address, aOk := args[1].(common.Address)
			tokenId, tiOk := args[2].(*big.Int)

			if !bnOk || !aOk || !tiOk {
				return "", fmt.Errorf("wrong Fn arguments: %w", retry.UnretryableErr)
			}

			var order struct {
				Token           common.Address
				TokenId         *big.Int
				Price           *big.Int
				Currency        common.Address
				Initiator       common.Address
				Receiver        common.Address
				Fulfilled       bool
				ExchangeAddress common.Address
			}

			orderV1, err := s.getExchangeOrder(ctx, blockNum, address, tokenId)
			if err != nil {
				return nil, err
			}

			order.Token = orderV1.Token
			order.TokenId = orderV1.TokenId
			order.Price = orderV1.Price
			order.Currency = orderV1.Currency
			order.Initiator = orderV1.Initiator
			order.Receiver = orderV1.Receiver
			order.Fulfilled = orderV1.Fulfilled
			order.ExchangeAddress = s.cfg.ExchangeAddress

			return order, nil
		},
		FnArgs: []any{
			big.NewInt(0).SetUint64(l.BlockNumber),
			l.Address,
			tokenId,
		},
		RetryOnAnyError: true,
		Backoff:         backoff,
		MaxElapsedTime:  30 * time.Second,
	}

	orderAny, err := retry.OnErrors(ctx, getOrderRetryOpts)
	if err != nil {
		return err
	}

	order, ok := orderAny.(struct {
		Token           common.Address
		TokenId         *big.Int
		Price           *big.Int
		Currency        common.Address
		Initiator       common.Address
		Receiver        common.Address
		Fulfilled       bool
		ExchangeAddress common.Address
	})
	if !ok {
		return errors.New("failed to cast order")
	}

	transfer := &domain.Transfer{
		CollectionAddress: l.Address,
		TokenId:           tokenId,
		FromAddress:       from,
		Number:            transferNumber,
	}
	id, err := s.repository.InsertTransfer(ctx, tx, transfer)
	if err != nil {
		return err
	}
	transfer.Id = id
	timestamp := now.Now().UnixMilli()
	if err := s.repository.InsertTransferStatus(ctx, tx, id, &domain.TransferStatus{
		Timestamp: now.Now().UnixMilli(),
		Status:    string(models.TransferStatusDrafted),
		TxId:      t.Hash(),
	}); err != nil {
		return err
	}
	o := &domain.Order{
		TransferId:      id,
		Price:           order.Price,
		Currency:        order.Currency,
		ExchangeAddress: order.ExchangeAddress,
	}
	orderId, err := s.repository.InsertOrder(ctx, tx, o)
	if err != nil {
		return err
	}
	if err := s.repository.InsertOrderStatus(ctx, tx, orderId, &domain.OrderStatus{
		Timestamp: timestamp,
		Status:    string(models.OrderStatusCreated),
		TxId:      t.Hash(),
	}); err != nil {
		return err
	}
	return nil
}

func (s *service) onTransferDraftCompletionEvent(
	ctx context.Context,
	tx pgx.Tx,
	t *types.Transaction,
	l *types.Log,
	tokenId *big.Int,
	to common.Address,
) error {
	exists, err := s.repository.TransferTxExists(ctx, tx, tokenId, t.Hash(), string(models.TransferStatusCreated))
	if err != nil {
		return err
	}
	if exists {
		return nil
	}
	token, err := s.repository.GetToken(ctx, tx, l.Address, tokenId)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil
		}
		return err
	}
	if token.CollectionAddress == s.cfg.FileBunniesCollectionAddress {
		metadata, metaUri, err := s.processMetadata(ctx, token)
		if err != nil {
			return fmt.Errorf("failed to process metadata for FileBunnies in TransferFinish: %w", err)
		}
		if err := s.repository.InsertMetadata(ctx, tx, metadata, token.CollectionAddress, token.TokenId); err != nil {
			return fmt.Errorf("failed to insert metadata: %w", err)
		}
		token.MetaUri = metaUri
	}

	if err := s.repository.UpdateToken(ctx, tx, token); err != nil {
		return fmt.Errorf("failed to update token: %w", err)
	}

	transfer, err := s.repository.GetActiveTransfer(ctx, tx, l.Address, tokenId)
	if err != nil {
		return fmt.Errorf("failed to get active transfer: %w", err)
	}
	order, err := s.repository.GetOrder(ctx, tx, transfer.OrderId)
	if err != nil {
		return fmt.Errorf("failed to order: %w", err)
	}
	timestamp := now.Now().UnixMilli()
	transfer.ToAddress = to
	if err := s.repository.UpdateTransfer(ctx, tx, transfer); err != nil {
		return err
	}
	if err := s.repository.InsertTransferStatus(ctx, tx, transfer.Id, &domain.TransferStatus{
		Timestamp: timestamp,
		Status:    string(models.TransferStatusCreated),
		TxId:      t.Hash(),
	}); err != nil {
		return err
	}
	if err := s.repository.InsertOrderStatus(ctx, tx, order.Id, &domain.OrderStatus{
		Timestamp: timestamp,
		Status:    string(models.OrderStatusFulfilled),
		TxId:      t.Hash(),
	}); err != nil {
		return err
	}

	if token.CollectionAddress == s.cfg.FileBunniesCollectionAddress {
		var suffix string
		if token.TokenId.Cmp(big.NewInt(6000)) == -1 {
			suffix = "common"
		} else if token.TokenId.Cmp(big.NewInt(7000)) == -1 {
			suffix = "uncommon"
		} else {
			suffix = "payed"
		}
		key := fmt.Sprintf("%s.%s", strings.ToLower(token.CollectionAddress.String()), suffix)
		if err := s.sequencer.DeleteTokenID(ctx, key, token.TokenId.Int64()); err != nil {
			log.Printf("failed deleting token from sequencer. Address: %s. Suffix:%s. TokendId: %s. Error: %v", token.CollectionAddress.String(), suffix, token.TokenId.String(), err)
		}
	}

	return nil
}

func (s *service) onPublicKeySetEvent(
	ctx context.Context,
	tx pgx.Tx,
	t *types.Transaction,
	l *types.Log,
	tokenId *big.Int,
	publicKey string,
) error {
	exists, err := s.repository.TransferTxExists(ctx, tx, tokenId, t.Hash(), string(models.TransferStatusPublicKeySet))
	if err != nil {
		return err
	}
	if exists {
		return nil
	}
	_, err = s.repository.GetToken(ctx, tx, l.Address, tokenId)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil
		}
		return err
	}
	transfer, err := s.repository.GetActiveTransfer(ctx, tx, l.Address, tokenId)
	if err != nil {
		return err
	}
	if err := s.repository.InsertTransferStatus(ctx, tx, transfer.Id, &domain.TransferStatus{
		Timestamp: now.Now().UnixMilli(),
		Status:    string(models.TransferStatusPublicKeySet),
		TxId:      t.Hash(),
	}); err != nil {
		return err
	}
	transfer.PublicKey = publicKey
	if err := s.repository.UpdateTransfer(ctx, tx, transfer); err != nil {
		return err
	}
	return nil
}

func (s *service) onPasswordSetEvent(
	ctx context.Context,
	tx pgx.Tx,
	t *types.Transaction,
	l *types.Log,
	tokenId *big.Int,
	encryptedPassword string,
) error {
	exists, err := s.repository.TransferTxExists(ctx, tx, tokenId, t.Hash(), string(models.TransferStatusPasswordSet))
	if err != nil {
		return err
	}
	if exists {
		return nil
	}
	_, err = s.repository.GetToken(ctx, tx, l.Address, tokenId)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil
		}
		return err
	}
	transfer, err := s.repository.GetActiveTransfer(ctx, tx, l.Address, tokenId)
	if err != nil {
		return err
	}
	if err := s.repository.InsertTransferStatus(ctx, tx, transfer.Id, &domain.TransferStatus{
		Timestamp: now.Now().UnixMilli(),
		Status:    string(models.TransferStatusPasswordSet),
		TxId:      t.Hash(),
	}); err != nil {
		return err
	}
	transfer.EncryptedPassword = encryptedPassword
	if err := s.repository.UpdateTransfer(ctx, tx, transfer); err != nil {
		return err
	}
	return nil
}

func (s *service) onTransferFinishEvent(
	ctx context.Context,
	tx pgx.Tx,
	t *types.Transaction,
	l *types.Log,
	tokenId *big.Int,
) error {
	exists, err := s.repository.TransferTxExists(ctx, tx, tokenId, t.Hash(), string(models.TransferStatusFinished))
	if err != nil {
		return err
	}
	if exists {
		return nil
	}
	_, err = s.repository.GetToken(ctx, tx, l.Address, tokenId)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil
		}
		return err
	}
	transfer, err := s.repository.GetActiveTransfer(ctx, tx, l.Address, tokenId)
	if err != nil {
		return err
	}
	timestamp := now.Now().UnixMilli()
	if err := s.repository.InsertTransferStatus(ctx, tx, transfer.Id, &domain.TransferStatus{
		Timestamp: timestamp,
		Status:    string(models.TransferStatusFinished),
		TxId:      t.Hash(),
	}); err != nil {
		return err
	}
	if transfer.OrderId != 0 {
		if err := s.repository.InsertOrderStatus(ctx, tx, transfer.OrderId, &domain.OrderStatus{
			Timestamp: timestamp,
			Status:    string(models.OrderStatusFinished),
			TxId:      t.Hash(),
		}); err != nil {
			return err
		}
	}
	token, err := s.repository.GetToken(ctx, tx, l.Address, tokenId)
	if err != nil {
		return err
	}
	token.Owner = transfer.ToAddress
	if err := s.repository.UpdateToken(ctx, tx, token); err != nil {
		return err
	}

	return nil
}

func (s *service) onTransferFraudReportedEvent(
	ctx context.Context,
	tx pgx.Tx,
	t *types.Transaction,
	l *types.Log,
	tokenId *big.Int,
) error {
	exists, err := s.repository.TransferTxExists(ctx, tx, tokenId, t.Hash(), string(models.TransferStatusFraudReported))
	if err != nil {
		return err
	}
	if exists {
		return nil
	}
	_, err = s.repository.GetToken(ctx, tx, l.Address, tokenId)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil
		}
		return err
	}
	transfer, err := s.repository.GetActiveTransfer(ctx, tx, l.Address, tokenId)
	if err != nil {
		return err
	}
	timestamp := now.Now().UnixMilli()
	if err := s.repository.InsertTransferStatus(ctx, tx, transfer.Id, &domain.TransferStatus{
		Timestamp: timestamp,
		Status:    string(models.TransferStatusFraudReported),
		TxId:      t.Hash(),
	}); err != nil {
		return err
	}
	return nil
}

func (s *service) onTransferFraudDecidedEvent(
	ctx context.Context,
	tx pgx.Tx,
	t *types.Transaction,
	l *types.Log,
	tokenId *big.Int,
	approved bool,
) error {
	exists, err := s.repository.TransferTxExists(ctx, tx, tokenId, t.Hash(), string(models.TransferStatusFinished))
	if err != nil {
		return err
	}
	if exists {
		return nil
	}
	_, err = s.repository.GetToken(ctx, tx, l.Address, tokenId)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil
		}
		return err
	}
	transfer, err := s.repository.GetActiveTransfer(ctx, tx, l.Address, tokenId)
	if err != nil {
		return err
	}
	timestamp := now.Now().UnixMilli()
	if err := s.repository.InsertTransferStatus(ctx, tx, transfer.Id, &domain.TransferStatus{
		Timestamp: timestamp,
		Status:    string(models.TransferStatusFinished),
		TxId:      t.Hash(),
	}); err != nil {
		return err
	}
	if transfer.OrderId != 0 {
		var orderStatus string
		if approved {
			orderStatus = string(models.OrderStatusFraudApproved)
		} else {
			orderStatus = string(models.OrderStatusFinished)
		}
		if err := s.repository.InsertOrderStatus(ctx, tx, transfer.OrderId, &domain.OrderStatus{
			Timestamp: timestamp,
			Status:    orderStatus,
			TxId:      t.Hash(),
		}); err != nil {
			return err
		}
	}
	if approved {
		transfer.FraudApproved = true
		if err := s.repository.UpdateTransfer(ctx, tx, transfer); err != nil {
			return err
		}
	} else {
		token, err := s.repository.GetToken(ctx, tx, l.Address, tokenId)
		if err != nil {
			return err
		}
		token.Owner = transfer.ToAddress
		if err := s.repository.UpdateToken(ctx, tx, token); err != nil {
			return err
		}
	}
	return nil
}

func (s *service) onTransferCancel(
	ctx context.Context,
	tx pgx.Tx,
	t *types.Transaction,
	l *types.Log,
	tokenId *big.Int,
) error {
	exists, err := s.repository.TransferTxExists(ctx, tx, tokenId, t.Hash(), string(models.TransferStatusCancelled))
	if err != nil {
		return err
	}
	if exists {
		return nil
	}
	_, err = s.repository.GetToken(ctx, tx, l.Address, tokenId)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil
		}
		return err
	}
	transfer, err := s.repository.GetActiveTransfer(ctx, tx, l.Address, tokenId)
	if err != nil {
		return err
	}
	timestamp := now.Now().UnixMilli()
	if err := s.repository.InsertTransferStatus(ctx, tx, transfer.Id, &domain.TransferStatus{
		Timestamp: timestamp,
		Status:    string(models.TransferStatusCancelled),
		TxId:      t.Hash(),
	}); err != nil {
		return err
	}
	if transfer.OrderId != 0 {
		if err := s.repository.InsertOrderStatus(ctx, tx, transfer.OrderId, &domain.OrderStatus{
			Timestamp: timestamp,
			Status:    string(models.OrderStatusCancelled),
			TxId:      t.Hash(),
		}); err != nil {
			return err
		}
	}
	return nil
}

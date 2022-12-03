package service

import (
	"context"
	"github.com/ethereum/go-ethereum/common"
	"github.com/jackc/pgx/v4"
	"github.com/mark3d-xyz/mark3d/indexer/internal/domain"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"log"
	"math/big"
)

func (s *service) GetTransfers(ctx context.Context,
	address common.Address) (*models.TransfersResponse, *models.ErrorResponse) {
	tx, err := s.postgres.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, internalError
	}
	defer s.postgres.RollbackTransaction(ctx, tx)
	incomingTransfers, err := s.postgres.GetActiveIncomingTransfersByAddress(ctx, tx, address)
	if err != nil {
		log.Println("get active incoming transfers failed: ", err)
		return nil, internalError
	}
	outgoingTransfers, err := s.postgres.GetActiveOutgoingTransfersByAddress(ctx, tx, address)
	if err != nil {
		log.Println("get active outgoing transfers failed: ", err)
		return nil, internalError
	}
	return &models.TransfersResponse{
		Incoming: domain.MapSlice(incomingTransfers, domain.TransferToModel),
		Outgoing: domain.MapSlice(outgoingTransfers, domain.TransferToModel),
	}, nil
}

func (s *service) GetTransfersHistory(ctx context.Context,
	address common.Address) (*models.TransfersResponse, *models.ErrorResponse) {
	tx, err := s.postgres.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, internalError
	}
	defer s.postgres.RollbackTransaction(ctx, tx)
	incomingTransfers, err := s.postgres.GetIncomingTransfersByAddress(ctx, tx, address)
	if err != nil {
		log.Println("get incoming transfers failed: ", err)
		return nil, internalError
	}
	outgoingTransfers, err := s.postgres.GetOutgoingTransfersByAddress(ctx, tx, address)
	if err != nil {
		log.Println("get outgoing transfers failed: ", err)
		return nil, internalError
	}
	return &models.TransfersResponse{
		Incoming: domain.MapSlice(incomingTransfers, domain.TransferToModel),
		Outgoing: domain.MapSlice(outgoingTransfers, domain.TransferToModel),
	}, nil
}

func (s *service) GetTransfer(ctx context.Context, address common.Address,
	tokenId *big.Int) (*models.Transfer, *models.ErrorResponse) {
	tx, err := s.postgres.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, internalError
	}
	defer s.postgres.RollbackTransaction(ctx, tx)
	res, err := s.postgres.GetActiveTransfer(ctx, tx, address, tokenId)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, internalError
	}
	return domain.TransferToModel(res), nil
}

func (s *service) GetTransfersV2(ctx context.Context, address common.Address) (*models.TransfersResponseV2, *models.ErrorResponse) {
	tx, err := s.postgres.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, internalError
	}
	defer s.postgres.RollbackTransaction(ctx, tx)
	incomingTransfers, err := s.postgres.GetActiveIncomingTransfersByAddress(ctx, tx, address)
	if err != nil {
		log.Println("get active incoming transfers failed: ", err)
		return nil, internalError
	}
	outgoingTransfers, err := s.postgres.GetActiveOutgoingTransfersByAddress(ctx, tx, address)
	if err != nil {
		log.Println("get active outgoing transfers failed: ", err)
		return nil, internalError
	}
	incoming, outgoing := make([]*models.TransferWithData, len(incomingTransfers)), make([]*models.TransferWithData, len(outgoingTransfers))
	for i, t := range incomingTransfers {
		token, err := s.postgres.GetToken(ctx, tx, t.CollectionAddress, t.TokenId)
		if err != nil {
			return nil, internalError
		}
		collection, err := s.postgres.GetCollection(ctx, tx, t.CollectionAddress)
		if err != nil {
			return nil, internalError
		}
		var order *domain.Order
		if t.OrderId != 0 {
			order, err = s.postgres.GetOrder(ctx, tx, t.OrderId)
			if err != nil {
				return nil, internalError
			}
		}
		incoming[i] = &models.TransferWithData{
			Collection: domain.CollectionToModel(collection),
			Order:      domain.OrderToModel(order),
			Token:      domain.TokenToModel(token),
			Transfer:   domain.TransferToModel(t),
		}
	}
	for i, t := range outgoingTransfers {
		token, err := s.postgres.GetToken(ctx, tx, t.CollectionAddress, t.TokenId)
		if err != nil {
			return nil, internalError
		}
		collection, err := s.postgres.GetCollection(ctx, tx, t.CollectionAddress)
		if err != nil {
			return nil, internalError
		}
		var order *domain.Order
		if t.OrderId != 0 {
			order, err = s.postgres.GetOrder(ctx, tx, t.OrderId)
			if err != nil {
				return nil, internalError
			}
		}
		outgoing[i] = &models.TransferWithData{
			Collection: domain.CollectionToModel(collection),
			Order:      domain.OrderToModel(order),
			Token:      domain.TokenToModel(token),
			Transfer:   domain.TransferToModel(t),
		}
	}
	return &models.TransfersResponseV2{
		Incoming: incoming,
		Outgoing: outgoing,
	}, nil
}

func (s *service) GetTransfersHistoryV2(ctx context.Context, address common.Address) (*models.TransfersResponseV2, *models.ErrorResponse) {
	tx, err := s.postgres.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, internalError
	}
	defer s.postgres.RollbackTransaction(ctx, tx)
	incomingTransfers, err := s.postgres.GetIncomingTransfersByAddress(ctx, tx, address)
	if err != nil {
		log.Println("get incoming transfers failed: ", err)
		return nil, internalError
	}
	outgoingTransfers, err := s.postgres.GetOutgoingTransfersByAddress(ctx, tx, address)
	if err != nil {
		log.Println("get outgoing transfers failed: ", err)
		return nil, internalError
	}
	incoming, outgoing := make([]*models.TransferWithData, len(incomingTransfers)), make([]*models.TransferWithData, len(outgoingTransfers))
	for i, t := range incomingTransfers {
		token, err := s.postgres.GetToken(ctx, tx, t.CollectionAddress, t.TokenId)
		if err != nil {
			return nil, internalError
		}
		collection, err := s.postgres.GetCollection(ctx, tx, t.CollectionAddress)
		if err != nil {
			return nil, internalError
		}
		var order *domain.Order
		if t.OrderId != 0 {
			order, err = s.postgres.GetOrder(ctx, tx, t.OrderId)
			if err != nil {
				return nil, internalError
			}
		}
		incoming[i] = &models.TransferWithData{
			Collection: domain.CollectionToModel(collection),
			Order:      domain.OrderToModel(order),
			Token:      domain.TokenToModel(token),
			Transfer:   domain.TransferToModel(t),
		}
	}
	for i, t := range outgoingTransfers {
		token, err := s.postgres.GetToken(ctx, tx, t.CollectionAddress, t.TokenId)
		if err != nil {
			return nil, internalError
		}
		collection, err := s.postgres.GetCollection(ctx, tx, t.CollectionAddress)
		if err != nil {
			return nil, internalError
		}
		var order *domain.Order
		if t.OrderId != 0 {
			order, err = s.postgres.GetOrder(ctx, tx, t.OrderId)
			if err != nil {
				return nil, internalError
			}
		}
		outgoing[i] = &models.TransferWithData{
			Collection: domain.CollectionToModel(collection),
			Order:      domain.OrderToModel(order),
			Token:      domain.TokenToModel(token),
			Transfer:   domain.TransferToModel(t),
		}
	}
	return &models.TransfersResponseV2{
		Incoming: incoming,
		Outgoing: outgoing,
	}, nil
}

func (s *service) GetTransferV2(ctx context.Context, address common.Address, tokenId *big.Int) (*models.TransferWithData, *models.ErrorResponse) {
	tx, err := s.postgres.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, internalError
	}
	defer s.postgres.RollbackTransaction(ctx, tx)
	res, err := s.postgres.GetActiveTransfer(ctx, tx, address, tokenId)
	if err != nil {
		return nil, internalError
	}
	token, err := s.postgres.GetToken(ctx, tx, address, tokenId)
	if err != nil {
		return nil, internalError
	}
	collection, err := s.postgres.GetCollection(ctx, tx, address)
	if err != nil {
		return nil, internalError
	}
	var order *domain.Order
	if res.OrderId != 0 {
		order, err = s.postgres.GetOrder(ctx, tx, res.OrderId)
		if err != nil {
			return nil, internalError
		}
	}
	return &models.TransferWithData{
		Collection: domain.CollectionToModel(collection),
		Order:      domain.OrderToModel(order),
		Token:      domain.TokenToModel(token),
		Transfer:   domain.TransferToModel(res),
	}, nil
}

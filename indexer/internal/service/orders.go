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

func (s *service) GetOrders(ctx context.Context,
	address common.Address) (*models.OrdersResponse, *models.ErrorResponse) {
	tx, err := s.postgres.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, internalError
	}
	defer s.postgres.RollbackTransaction(ctx, tx)
	incomingOrders, err := s.postgres.GetActiveIncomingOrdersByAddress(ctx, tx, address)
	if err != nil {
		log.Println("get active incoming orders failed: ", err)
		return nil, internalError
	}
	outgoingOrders, err := s.postgres.GetActiveOutgoingOrdersByAddress(ctx, tx, address)
	if err != nil {
		log.Println("get active outgoing orders failed: ", err)
		return nil, internalError
	}
	return &models.OrdersResponse{
		Incoming: domain.MapSlice(incomingOrders, domain.OrderToModel),
		Outgoing: domain.MapSlice(outgoingOrders, domain.OrderToModel),
	}, nil
}

func (s *service) GetOrdersHistory(ctx context.Context,
	address common.Address) (*models.OrdersResponse, *models.ErrorResponse) {
	tx, err := s.postgres.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, internalError
	}
	defer s.postgres.RollbackTransaction(ctx, tx)
	incomingOrders, err := s.postgres.GetIncomingOrdersByAddress(ctx, tx, address)
	if err != nil {
		log.Println("get incoming orders failed: ", err)
		return nil, internalError
	}
	outgoingOrders, err := s.postgres.GetOutgoingOrdersByAddress(ctx, tx, address)
	if err != nil {
		log.Println("get outgoing orders failed: ", err)
		return nil, internalError
	}
	return &models.OrdersResponse{
		Incoming: domain.MapSlice(incomingOrders, domain.OrderToModel),
		Outgoing: domain.MapSlice(outgoingOrders, domain.OrderToModel),
	}, nil
}

func (s *service) GetOrder(ctx context.Context, address common.Address,
	tokenId *big.Int) (*models.Order, *models.ErrorResponse) {
	tx, err := s.postgres.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, internalError
	}
	defer s.postgres.RollbackTransaction(ctx, tx)
	res, err := s.postgres.GetActiveOrder(ctx, tx, address, tokenId)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, orderNotExistError
		}
		return nil, internalError
	}
	return domain.OrderToModel(res), nil
}

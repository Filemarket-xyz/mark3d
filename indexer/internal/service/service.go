package service

import (
	"context"
	"github.com/ethereum/go-ethereum/common"
	"github.com/mark3d-xyz/mark3d/indexer/internal/postgres"
	"github.com/mark3d-xyz/mark3d/indexer/models"
)

type Service interface {
	Tokens
	Transfers
	Orders
	ListenBlockchain()
	Shutdown()
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
	postgres postgres.Postgres
}

func NewService(postgres postgres.Postgres) Service {
	return &service{
		postgres: postgres,
	}
}

func (s *service) ListenBlockchain() {

}

func (s *service) Shutdown() {

}

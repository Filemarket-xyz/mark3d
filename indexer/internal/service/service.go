package service

import (
	"context"
	"github.com/mark3d-xyz/mark3d/indexer/internal/postgres"
	"github.com/mark3d-xyz/mark3d/indexer/models"
)

type Service interface {
	Tokens
	Transfers
	Orders
	Shutdown() error
}

type Tokens interface {
	GetTokensByAddress(ctx context.Context, address string) (*models.TokensResponse, *models.ErrorResponse)
}

type Transfers interface {
	GetTransfers(ctx context.Context, address string) (*models.TransfersResponse, *models.ErrorResponse)
	GetTransfersHistory(ctx context.Context, address string) (*models.TransfersResponse, *models.ErrorResponse)
}

type Orders interface {
	GetOrders(ctx context.Context, address string) (*models.OrdersResponse, *models.ErrorResponse)
	GetOrdersHistory(ctx context.Context, address string) (*models.OrdersResponse, *models.ErrorResponse)
}

type service struct {
	postgres postgres.Postgres
}

func NewService(postgres postgres.Postgres) Service {
	return &service{
		postgres: postgres,
	}
}

func (s *service) Shutdown() error {

}

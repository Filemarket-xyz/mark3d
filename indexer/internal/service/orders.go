package service

import (
	"context"
	"github.com/mark3d-xyz/mark3d/indexer/models"
)

func (s *service) GetOrders(ctx context.Context,
	address string) (*models.OrdersResponse, *models.ErrorResponse) {

}

func (s *service) GetOrdersHistory(ctx context.Context,
	address string) (*models.OrdersResponse, *models.ErrorResponse) {

}

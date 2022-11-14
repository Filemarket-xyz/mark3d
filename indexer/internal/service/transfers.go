package service

import (
	"context"
	"github.com/mark3d-xyz/mark3d/indexer/models"
)

func (s *service) GetTransfers(ctx context.Context,
	address string) (*models.TransfersResponse, *models.ErrorResponse) {

}

func (s *service) GetTransfersHistory(ctx context.Context,
	address string) (*models.TransfersResponse, *models.ErrorResponse) {

}

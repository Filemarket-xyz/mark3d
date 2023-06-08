package service

import (
	"context"
	"github.com/ethereum/go-ethereum/common"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"log"
	"math/big"
	"strings"
)

func (s *service) SequencerAcquire(ctx context.Context, address common.Address) (*models.SequencerAcquireResponse, *models.ErrorResponse) {
	tokenId, err := s.sequencer.Acquire(ctx, strings.ToLower(address.String()))
	if err != nil {
		log.Println("Acquire tokenId failed: ", err)
		return nil, internalError
	}
	return &models.SequencerAcquireResponse{TokenID: big.NewInt(tokenId).String()}, nil
}

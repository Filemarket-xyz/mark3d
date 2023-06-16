package service

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"log"
	"math/big"
	"strings"
)

func (s *service) SequencerAcquire(ctx context.Context, address common.Address, suffix string) (*models.SequencerAcquireResponse, *models.ErrorResponse) {
	key := strings.ToLower(address.String())
	if suffix != "" {
		key = fmt.Sprintf("%s.%s", strings.ToLower(address.String()), suffix)
	}
	tokenId, err := s.sequencer.Acquire(ctx, key)
	if err != nil {
		log.Println("Acquire tokenId failed: ", err)
		return nil, internalError
	}
	return &models.SequencerAcquireResponse{TokenID: big.NewInt(tokenId).String()}, nil
}

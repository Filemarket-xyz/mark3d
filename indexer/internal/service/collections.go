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

func (s *service) GetCollection(ctx context.Context,
	address common.Address) (*models.Collection, *models.ErrorResponse) {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, internalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)
	collection, err := s.repository.GetCollection(ctx, tx, address)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		log.Println("get collection failed: ", err)
		return nil, internalError
	}

	c := domain.CollectionToModel(collection)
	if collection.Address == s.cfg.FileBunniesCollectionAddress {
		stats, err := s.repository.GetFileBunniesStats(ctx, tx)
		if err != nil {
			logger.Errorf("failed to get stats", err, nil)
			return nil, internalError
		}
		for _, s := range stats {
			c.Stats = append(c.Stats, &models.CollectionStat{Name: s.Name, Value: s.Value})
		}
	}

	return c, nil
}

func (s *service) GetCollectionWithTokens(
	ctx context.Context,
	address common.Address,
	lastTokenId *big.Int,
	limit int,
) (*models.CollectionData, *models.ErrorResponse) {
	tx, err := s.repository.BeginTransaction(ctx, pgx.TxOptions{})
	if err != nil {
		log.Println("begin tx failed: ", err)
		return nil, internalError
	}
	defer s.repository.RollbackTransaction(ctx, tx)
	collection, err := s.repository.GetCollection(ctx, tx, address)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		log.Println("get collection failed: ", err)
		return nil, internalError
	}
	tokens, err := s.repository.GetCollectionTokens(ctx, tx, address, lastTokenId, limit)
	if err != nil {
		log.Println("get collection tokens failed: ", err)
		return nil, internalError
	}
	total, err := s.repository.GetCollectionTokensTotal(ctx, tx, address)
	if err != nil {
		log.Println("get collection tokens total failed: ", err)
		return nil, internalError
	}

	c := domain.CollectionToModel(collection)
	if collection.Address == s.cfg.FileBunniesCollectionAddress {
		stats, err := s.repository.GetFileBunniesStats(ctx, tx)
		if err != nil {
			logger.Errorf("failed to get stats", err, nil)
			return nil, internalError
		}
		for _, s := range stats {
			c.Stats = append(c.Stats, &models.CollectionStat{Name: s.Name, Value: s.Value})
		}
	}
	return &models.CollectionData{
		Collection: c,
		Tokens:     domain.MapSlice(tokens, domain.TokenToModel),
		Total:      total,
	}, nil
}

func (s *service) GetPublicCollectionWithTokens(
	ctx context.Context,
	lastTokenId *big.Int,
	limit int,
) (*models.CollectionData, *models.ErrorResponse) {
	return s.GetCollectionWithTokens(ctx, s.cfg.PublicCollectionAddress, lastTokenId, limit)
}

func (s *service) GetFileBunniesCollectionWithTokens(
	ctx context.Context,
	lastTokenId *big.Int,
	limit int,
) (*models.CollectionData, *models.ErrorResponse) {
	return s.GetCollectionWithTokens(ctx, s.cfg.FileBunniesCollectionAddress, lastTokenId, limit)
}

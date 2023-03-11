package repository

import (
	"context"
	"github.com/go-redis/redis/v8"
	"log"
	"math/big"
)

const (
	lastBlockKey = "last_block"
)

type BlockCounter interface {
	GetLastBlock(ctx context.Context) (*big.Int, error)
	SetLastBlock(ctx context.Context, lastBlock *big.Int) error
}

type blockCounter struct {
	rdb *redis.Client
}

func (b *blockCounter) GetLastBlock(ctx context.Context) (*big.Int, error) {
	num := b.rdb.Get(ctx, lastBlockKey)
	if num.Err() != nil {
		log.Printf("key error. Key: %s, err: %s", lastBlockKey, num.Err())
		return nil, num.Err()
	}
	res, _ := big.NewInt(0).SetString(num.String(), 10)
	return res, nil
}

func (b *blockCounter) SetLastBlock(ctx context.Context, lastBlock *big.Int) error {
	return b.rdb.Set(ctx, lastBlockKey, lastBlock.String(), redis.KeepTTL).Err()
}

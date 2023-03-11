package repository

import (
	"context"
	"fmt"
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
	res, ok := big.NewInt(0).SetString(num.String(), 10)
	if !ok {
		return nil, fmt.Errorf("parse block num: %s failed", num.String())
	}
	return res, nil
}

func (b *blockCounter) SetLastBlock(ctx context.Context, lastBlock *big.Int) error {
	return b.rdb.Set(ctx, lastBlockKey, lastBlock.String(), redis.KeepTTL).Err()
}

package repository

import (
	"github.com/ethereum/go-ethereum/common"
	"github.com/go-redis/redis/v8"
	"github.com/jackc/pgx/v4/pgxpool"
)

type Repository interface {
	Postgres
	BlockCounter
}

type Config struct {
	PublicCollectionAddress common.Address
}

type repository struct {
	cfg *Config
	*postgres
	*blockCounter
}

func NewRepository(pg *pgxpool.Pool, rdb *redis.Client, cfg *Config) Repository {
	return &repository{
		cfg: cfg,
		postgres: &postgres{
			pg: pg,
			cfg: &postgresConfig{
				publicCollectionAddress: cfg.PublicCollectionAddress,
			},
		},
		blockCounter: &blockCounter{
			rdb: rdb,
		},
	}
}

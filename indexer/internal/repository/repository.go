package repository

import (
	"github.com/go-redis/redis/v8"
	"github.com/jackc/pgx/v4/pgxpool"
)

type Repository interface {
	Postgres
	BlockCounter
}

type repository struct {
	*postgres
	*blockCounter
}

func NewRepository(pg *pgxpool.Pool, rdb *redis.Client) Repository {
	return &repository{
		postgres: &postgres{
			pg: pg,
		},
		blockCounter: &blockCounter{
			rdb: rdb,
		},
	}
}

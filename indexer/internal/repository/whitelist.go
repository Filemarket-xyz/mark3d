package repository

import (
	"context"
	"github.com/ethereum/go-ethereum/common"
	"github.com/jackc/pgx/v4"
	"strings"
)

func (p *postgres) AddressInWhitelist(ctx context.Context, tx pgx.Tx, address common.Address) ([]string, error) {
	// language=PostgreSQL
	rows, err := tx.Query(
		ctx,
		`SELECT DISTINCT(rarity) FROM file_bunnies_whitelist WHERE address=$1`,
		strings.ToLower(address.String()),
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	res := make([]string, 0, 2)
	for rows.Next() {
		var rarity string
		if err := rows.Scan(&rarity); err != nil {
			return nil, err
		}
		res = append(res, rarity)
	}
	return res, nil
}

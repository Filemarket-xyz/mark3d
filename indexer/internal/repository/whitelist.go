package repository

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/jackc/pgx/v4"
	"strings"
)

func (p *postgres) AddressInWhitelist(ctx context.Context, tx pgx.Tx, address common.Address) (string, error) {
	// language=PostgreSQL
	rows, err := tx.Query(
		ctx,
		`SELECT DISTINCT(rarity) FROM file_bunnies_whitelist WHERE address=$1`,
		strings.ToLower(address.String()),
	)
	if err != nil {
		return "", err
	}
	defer rows.Close()

	res := make([]string, 0, 2)
	for rows.Next() {
		var rarity string
		if err := rows.Scan(&rarity); err != nil {
			return "", err
		}
		res = append(res, rarity)
	}

	switch len(res) {
	case 0:
		return "", nil
	case 1:
		return res[0], nil
	default:
		err := fmt.Errorf("address in multiple whitelist rarities. Address: %s", address)
		logger.Error("DB error", err, nil)
		return "", err
	}
}

package postgres

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/jackc/pgx/v4"
	"github.com/mark3d-xyz/mark3d/indexer/internal/domain"
	"math/big"
	"strings"
)

func (p *postgres) GetTokensByAddress(ctx context.Context, tx pgx.Tx,
	address common.Address) ([]*domain.Token, error) {
	// language=PostgreSQL
	rows, err := tx.Query(ctx, `SELECT collection_address,token_id,owner,
       meta_uri,name,description,image,hidden_file FROM tokens WHERE owner=$1`,
		strings.ToLower(address.String()))
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var res []*domain.Token
	for rows.Next() {
		var collectionAddress, tokenId, owner string
		t := &domain.Token{}
		if err := rows.Scan(&collectionAddress, &tokenId, &owner, &t.MetaUri,
			&t.Name, &t.Description, &t.Image, &t.HiddenFile); err != nil {
			return nil, err
		}
		t.CollectionAddress, t.Owner = common.HexToAddress(collectionAddress), common.HexToAddress(owner)
		var ok bool
		t.TokenId, ok = big.NewInt(0).SetString(tokenId, 10)
		if !ok {
			return nil, fmt.Errorf("failed to parse big int: %s", tokenId)
		}
		res = append(res, t)
	}
	return res, nil
}

func (p *postgres) GetToken(ctx context.Context, tx pgx.Tx,
	contractAddress common.Address, tokenId *big.Int) (*domain.Token, error) {
	// language=PostgreSQL
	row := tx.QueryRow(ctx, `SELECT owner,meta_uri,name,description,
       image,hidden_file FROM tokens WHERE collection_address=$1 AND token_id=$2`,
		strings.ToLower(contractAddress.String()), tokenId.String())
	var owner string
	t := &domain.Token{}
	if err := row.Scan(&owner, &t.MetaUri, &t.Name, &t.Description, &t.Image, &t.HiddenFile); err != nil {
		return nil, err
	}
	t.CollectionAddress, t.TokenId, t.Owner = contractAddress, tokenId, common.HexToAddress(owner)
	return t, nil
}

func (p *postgres) InsertToken(ctx context.Context, tx pgx.Tx, token *domain.Token) error {
	// language=PostgreSQL
	if _, err := tx.Exec(ctx, `INSERT INTO tokens VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
		strings.ToLower(token.CollectionAddress.String()), token.TokenId.String(),
		strings.ToLower(token.Owner.String()), token.MetaUri, token.Name,
		token.Description, token.Image, token.HiddenFile); err != nil {
		return err
	}
	return nil
}

func (p *postgres) UpdateToken(ctx context.Context, tx pgx.Tx, token *domain.Token) error {
	// language=PostgreSQL
	if _, err := tx.Exec(ctx, `UPDATE tokens SET owner=$1,meta_uri=$2 WHERE collection_address=$3 AND token_id=$4`,
		strings.ToLower(token.Owner.String()), token.MetaUri,
		strings.ToLower(token.CollectionAddress.String()), token.TokenId.String()); err != nil {
		return err
	}
	return nil
}

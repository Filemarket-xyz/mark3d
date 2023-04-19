package repository

import (
	"context"
	"fmt"
	"math/big"
	"strings"

	"github.com/ethereum/go-ethereum/common"
	"github.com/jackc/pgx/v4"
	"github.com/mark3d-xyz/mark3d/indexer/internal/domain"
)

func (p *postgres) GetCollectionTokens(ctx context.Context, tx pgx.Tx,
	address common.Address) ([]*domain.Token, error) {
	// language=PostgreSQL
	rows, err := tx.Query(ctx, `SELECT collection_address,token_id,owner,
       meta_uri,name,description,image,hidden_file,creator FROM tokens WHERE collection_address=$1`,
		strings.ToLower(address.String()))
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var res []*domain.Token
	for rows.Next() {
		var collectionAddress, tokenId, owner, creator string
		t := &domain.Token{}
		if err := rows.Scan(&collectionAddress, &tokenId, &owner, &t.MetaUri,
			&t.Name, &t.Description, &t.Image, &t.HiddenFile, &creator); err != nil {
			return nil, err
		}
		t.CollectionAddress, t.Owner, t.Creator = common.HexToAddress(collectionAddress), common.HexToAddress(owner),
			common.HexToAddress(creator)
		var ok bool
		t.TokenId, ok = big.NewInt(0).SetString(tokenId, 10)
		if !ok {
			return nil, fmt.Errorf("failed to parse big int: %s", tokenId)
		}
		res = append(res, t)
	}
	return res, nil
}

func (p *postgres) GetTokensByAddress(ctx context.Context, tx pgx.Tx,
	address common.Address) ([]*domain.Token, error) {
	// language=PostgreSQL
	rows, err := tx.Query(ctx, `SELECT collection_address,token_id,owner,
       meta_uri,name,description,image,hidden_file,creator FROM tokens WHERE owner=$1`,
		strings.ToLower(address.String()))
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var res []*domain.Token
	for rows.Next() {
		var collectionAddress, tokenId, owner, creator string
		t := &domain.Token{}
		if err := rows.Scan(&collectionAddress, &tokenId, &owner, &t.MetaUri,
			&t.Name, &t.Description, &t.Image, &t.HiddenFile, &creator); err != nil {
			return nil, err
		}
		t.CollectionAddress, t.Owner, t.Creator = common.HexToAddress(collectionAddress), common.HexToAddress(owner),
			common.HexToAddress(creator)
		var ok bool
		t.TokenId, ok = big.NewInt(0).SetString(tokenId, 10)
		if !ok {
			return nil, fmt.Errorf("failed to parse big int: %s", tokenId)
		}
		res = append(res, t)
	}
	return res, nil
}

func (p *postgres) GetToken(
	ctx context.Context,
	tx pgx.Tx,
	contractAddress common.Address,
	tokenId *big.Int,
) (*domain.Token, error) {
	// language=PostgreSQL
	query := `
		SELECT
			t.owner,
			t.meta_uri,
			t.name,
			t.description,
			t.image,
			t.hidden_file,
			t.creator, 
			c.name 
		FROM 
			tokens t
		INNER JOIN 
			collections c ON t.collection_address = c.address
		WHERE 
			t.collection_address=$1 AND t.token_id=$2
		`
	row := tx.QueryRow(
		ctx,
		query,
		strings.ToLower(contractAddress.String()),
		tokenId.String(),
	)

	token := &domain.Token{}
	var owner, creator string

	err := row.Scan(
		&owner,
		&token.MetaUri,
		&token.Name,
		&token.Description,
		&token.Image,
		&token.HiddenFile,
		&creator,
		&token.CollectionName,
	)
	if err != nil {
		return nil, err
	}

	token.CollectionAddress = contractAddress
	token.TokenId = tokenId
	token.Owner = common.HexToAddress(owner)
	token.Creator = common.HexToAddress(creator)

	return token, nil
}


func (p *postgres) InsertToken(ctx context.Context, tx pgx.Tx, token *domain.Token) error {
	// language=PostgreSQL
	if _, err := tx.Exec(ctx, `INSERT INTO tokens VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT ON CONSTRAINT tokens_pkey DO NOTHING `,
		strings.ToLower(token.CollectionAddress.String()), token.TokenId.String(),
		strings.ToLower(token.Owner.String()), token.MetaUri, token.Name,
		token.Description, token.Image, token.HiddenFile,
		strings.ToLower(token.Creator.String())); err != nil {
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

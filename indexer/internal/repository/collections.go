package repository

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/jackc/pgx/v4"
	"github.com/mark3d-xyz/mark3d/indexer/internal/domain"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"math/big"
	"strings"
)

// GetCollectionsByOwnerAddress returns owned collections or collections of owned tokens
func (p *postgres) GetCollectionsByOwnerAddress(
	ctx context.Context,
	tx pgx.Tx,
	address common.Address,
	lastCollectionAddress *common.Address,
	limit int,
) ([]*domain.Collection, error) {
	// language=PostgreSQL
	query := `
		SELECT address,creator,owner,name,token_id,meta_uri,description,image
		FROM collections AS c 
		WHERE (owner=$1 OR 
            EXISTS (SELECT 1 FROM tokens AS t WHERE t.collection_address=c.address AND t.owner=$1) OR 
		    c.address=$2) AND
		    address > $3
		ORDER BY address
		LIMIT $4
	`

	lastCollectionAddressStr := ""
	if lastCollectionAddress != nil {
		lastCollectionAddressStr = strings.ToLower(lastCollectionAddress.String())
	}
	if limit == 0 {
		limit = 10000
	}

	rows, err := tx.Query(ctx, query,
		strings.ToLower(address.String()),
		strings.ToLower(p.cfg.publicCollectionAddress.String()),
		lastCollectionAddressStr,
		limit,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var res []*domain.Collection
	for rows.Next() {
		var collectionAddress, creator, owner, tokenId string
		c := &domain.Collection{}
		if err := rows.Scan(&collectionAddress, &creator, &owner, &c.Name,
			&tokenId, &c.MetaUri, &c.Description, &c.Image); err != nil {
			return nil, err
		}

		c.Address = common.HexToAddress(collectionAddress)
		c.Owner = common.HexToAddress(owner)
		c.Creator = common.HexToAddress(creator)

		var ok bool
		c.TokenId, ok = big.NewInt(0).SetString(tokenId, 10)
		if !ok {
			return nil, fmt.Errorf("failed to parse big int: %s", tokenId)
		}

		switch c.Address {
		case p.cfg.publicCollectionAddress:
			c.Type = models.CollectionTypePublicCollection
		case p.cfg.fileBunniesCollectionAddress:
			c.Type = models.CollectionTypeFileBunniesCollection
		default:
			c.Type = models.CollectionTypeFileMarketCollection
		}
		res = append(res, c)
	}
	return res, nil
}

func (p *postgres) GetCollectionsByOwnerAddressTotal(
	ctx context.Context,
	tx pgx.Tx,
	address common.Address,
) (uint64, error) {
	// language=PostgreSQL
	query := `
		SELECT COUNT(*) AS total
		FROM collections AS c 
		WHERE (owner=$1 OR 
            EXISTS (SELECT 1 FROM tokens AS t WHERE t.collection_address=c.address AND t.owner=$1)) OR 
		    c.address=$2
	`
	var total uint64
	row := tx.QueryRow(ctx, query,
		strings.ToLower(address.String()),
		strings.ToLower(p.cfg.publicCollectionAddress.String()),
	)
	if err := row.Scan(&total); err != nil {
		return 0, err
	}

	return total, nil
}

func (p *postgres) GetCollection(ctx context.Context,
	tx pgx.Tx, contractAddress common.Address) (*domain.Collection, error) {
	// language=PostgreSQL
	row := tx.QueryRow(ctx, `SELECT address,creator,owner,name,token_id,meta_uri,description,
       image FROM collections WHERE address=$1`, strings.ToLower(contractAddress.String()))
	var collectionAddress, creator, owner, tokenId string
	c := &domain.Collection{}
	if err := row.Scan(&collectionAddress, &creator, &owner, &c.Name, &tokenId,
		&c.MetaUri, &c.Description, &c.Image); err != nil {
		return nil, err
	}
	c.Address, c.Owner, c.Creator = contractAddress, common.HexToAddress(creator), common.HexToAddress(owner)
	var ok bool
	c.TokenId, ok = big.NewInt(0).SetString(tokenId, 10)
	if !ok {
		return nil, fmt.Errorf("failed to parse big int: %s", tokenId)
	}

	switch c.Address {
	case p.cfg.publicCollectionAddress:
		c.Type = models.CollectionTypePublicCollection
	case p.cfg.fileBunniesCollectionAddress:
		c.Type = models.CollectionTypeFileBunniesCollection
	default:
		c.Type = models.CollectionTypeFileMarketCollection
	}
	return c, nil
}

func (p *postgres) GetCollectionByTokenId(
	ctx context.Context,
	tx pgx.Tx,
	tokenId *big.Int,
) (*domain.Collection, error) {
	// language=PostgreSQL
	query := `
	SELECT address,creator,owner,name,meta_uri,description,image 
	FROM collections 
	WHERE token_id=$1
	`
	row := tx.QueryRow(ctx, query, tokenId.String())
	var collectionAddress, creator, owner string
	c := &domain.Collection{
		TokenId: tokenId,
	}

	if err := row.Scan(
		&collectionAddress,
		&creator,
		&owner,
		&c.Name,
		&c.MetaUri,
		&c.Description,
		&c.Image,
	); err != nil {
		return nil, err
	}

	c.Address = common.HexToAddress(collectionAddress)
	c.Owner = common.HexToAddress(owner)
	c.Creator = common.HexToAddress(creator)

	switch c.Address {
	case p.cfg.publicCollectionAddress:
		c.Type = models.CollectionTypePublicCollection
	case p.cfg.fileBunniesCollectionAddress:
		c.Type = models.CollectionTypeFileBunniesCollection
	default:
		c.Type = models.CollectionTypeFileMarketCollection
	}
	return c, nil
}

func (p *postgres) InsertCollection(ctx context.Context, tx pgx.Tx,
	collection *domain.Collection) error {
	// language=PostgreSQL
	if _, err := tx.Exec(ctx, `INSERT INTO collections VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
		strings.ToLower(collection.Address.String()), strings.ToLower(collection.Creator.String()),
		strings.ToLower(collection.Owner.String()), collection.Name, collection.TokenId.String(),
		collection.MetaUri, collection.Description, collection.Image); err != nil {
		return err
	}
	return nil
}

func (p *postgres) InsertCollectionTransfer(ctx context.Context, tx pgx.Tx,
	collectionAddress common.Address, transfer *domain.CollectionTransfer) error {
	// language=PostgreSQL
	if _, err := tx.Exec(ctx, `INSERT INTO collection_transfers VALUES ($1,$2,$3,$4,$5)`,
		strings.ToLower(collectionAddress.String()), transfer.Timestamp,
		strings.ToLower(transfer.From.String()), strings.ToLower(transfer.To.String()),
		strings.ToLower(transfer.TxId.String())); err != nil {
		return err
	}
	return nil
}

func (p *postgres) UpdateCollection(ctx context.Context, tx pgx.Tx,
	collection *domain.Collection) error {
	// language=PostgreSQL
	if _, err := tx.Exec(ctx, `UPDATE collections SET owner=$1,name=$2,meta_uri=$3 WHERE address=$4`,
		strings.ToLower(collection.Owner.String()), collection.Name, collection.MetaUri,
		strings.ToLower(collection.Address.String())); err != nil {
		return err
	}
	return nil
}

func (p *postgres) CollectionTransferExists(ctx context.Context, tx pgx.Tx, txId string) (bool, error) {
	// language=PostgreSQL
	row := tx.QueryRow(ctx, `SELECT COUNT(*) FROM collection_transfers WHERE tx_id=$1`, txId)
	var res int64
	if err := row.Scan(&res); err != nil {
		return false, err
	}
	return res > 0, nil
}

func (p *postgres) GetFileBunniesStats(
	ctx context.Context,
	tx pgx.Tx,
) ([]*domain.CollectionStats, error) {
	// language=PostgreSQL
	query := `
		SELECT
			SUM(CASE WHEN token_id::bigint BETWEEN 0 AND 5999 THEN 1 ELSE 0 END) AS common_minted_amount,
			SUM(CASE WHEN token_id::bigint BETWEEN 0 AND 5999 AND meta_uri != '' THEN 1 ELSE 0 END) AS common_bought_amount,
			SUM(CASE WHEN token_id::bigint BETWEEN 6000 AND 6999 THEN 1 ELSE 0 END) AS uncommon_minted_amount,
			SUM(CASE WHEN token_id::bigint BETWEEN 6000 AND 6999 AND meta_uri != '' THEN 1 ELSE 0 END) AS uncommon_bought_amount,
			SUM(CASE WHEN token_id::bigint BETWEEN 7000 AND 9999 THEN 1 ELSE 0 END) AS payed_minted_amount,
			SUM(CASE WHEN token_id::bigint BETWEEN 7000 AND 9999 AND meta_uri != '' THEN 1 ELSE 0 END) AS payed_bought_amount
		FROM public.tokens
		WHERE collection_address=$1
	`
	stats := []*domain.CollectionStats{
		{Name: "common.minted_amount"},
		{Name: "common.bought_amount"},
		{Name: "uncommon.minted_amount"},
		{Name: "uncommon.bought_amount"},
		{Name: "payed.minted_amount"},
		{Name: "payed.bought_amount"},
	}
	if err := tx.QueryRow(ctx, query,
		strings.ToLower(p.cfg.fileBunniesCollectionAddress.String()),
	).Scan(
		&stats[0].Value,
		&stats[1].Value,
		&stats[2].Value,
		&stats[3].Value,
		&stats[4].Value,
		&stats[5].Value,
	); err != nil {
		return nil, err
	}

	return stats, nil
}

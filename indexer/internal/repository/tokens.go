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

func (p *postgres) GetCollectionTokens(
	ctx context.Context,
	tx pgx.Tx,
	address common.Address,
) ([]*domain.Token, error) {
	// language=PostgreSQL
	query := `
		SELECT collection_address,token_id,owner,meta_uri,creator,metadata_id
		FROM tokens WHERE collection_address=$1
	`
	rows, err := tx.Query(ctx, query, strings.ToLower(address.String()))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var res []*domain.Token
	for rows.Next() {
		var collectionAddress, tokenId, owner, creator string
		var metadataId int64
		t := &domain.Token{}

		err := rows.Scan(&collectionAddress, &tokenId, &owner, &t.MetaUri, &creator, &metadataId)
		if err != nil {
			return nil, err
		}

		metadata, err := p.GetMetadata(ctx, tx, metadataId)
		if err != nil {
			return nil, err
		}

		t.CollectionAddress = common.HexToAddress(collectionAddress)
		t.Owner = common.HexToAddress(owner)
		t.Creator = common.HexToAddress(creator)
		t.Metadata = metadata

		var ok bool
		t.TokenId, ok = big.NewInt(0).SetString(tokenId, 10)
		if !ok {
			return nil, fmt.Errorf("failed to parse big int: %s", tokenId)
		}
		res = append(res, t)
	}
	return res, nil
}

func (p *postgres) GetTokensByAddress(
	ctx context.Context,
	tx pgx.Tx,
	address common.Address,
) ([]*domain.Token, error) {
	// language=PostgreSQL
	query := `
		SELECT collection_address,token_id,owner,meta_uri,creator,metadata_id
		FROM tokens WHERE owner=$1
	`

	rows, err := tx.Query(ctx, query, strings.ToLower(address.String()))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var res []*domain.Token
	for rows.Next() {
		var collectionAddress, tokenId, owner, creator string
		var metadataId int64
		t := &domain.Token{}

		err := rows.Scan(&collectionAddress, &tokenId, &owner, &t.MetaUri, &creator, &metadataId)
		if err != nil {
			return nil, err
		}

		metadata, err := p.GetMetadata(ctx, tx, metadataId)
		if err != nil {
			return nil, err
		}

		t.CollectionAddress = common.HexToAddress(collectionAddress)
		t.Owner = common.HexToAddress(owner)
		t.Creator = common.HexToAddress(creator)
		t.Metadata = metadata

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
		SELECT t.owner, t.meta_uri, t.creator, c.name, t.metadata_id
		FROM tokens t
		INNER JOIN collections c ON t.collection_address = c.address
		LEFT JOIN token_metadata tm on tm.id = t.metadata_id
		WHERE t.collection_address=$1 AND t.token_id=$2
		`
	row := tx.QueryRow(
		ctx,
		query,
		strings.ToLower(contractAddress.String()),
		tokenId.String(),
	)

	token := &domain.Token{}
	var owner, creator string
	var metadataId int64

	err := row.Scan(
		&owner,
		&token.MetaUri,
		&creator,
		&token.CollectionName,
		&metadataId,
	)
	if err != nil {
		return nil, err
	}

	metadata, err := p.GetMetadata(ctx, tx, metadataId)
	if err != nil {
		return nil, err
	}

	token.CollectionAddress = contractAddress
	token.TokenId = tokenId
	token.Owner = common.HexToAddress(owner)
	token.Creator = common.HexToAddress(creator)
	token.Metadata = metadata

	return token, nil
}

func (p *postgres) InsertToken(ctx context.Context, tx pgx.Tx, token *domain.Token) error {
	// language=PostgreSQL
	query := `
		INSERT INTO tokens (collection_address, token_id, owner, meta_uri, creator, metadata_id)
		VALUES ($1,$2,$3,$4,$5,$6) 
		ON CONFLICT ON CONSTRAINT tokens_pkey DO NOTHING
	`
	_, err := tx.Exec(
		ctx,
		query,
		strings.ToLower(token.CollectionAddress.String()),
		token.TokenId.String(),
		strings.ToLower(token.Owner.String()),
		token.MetaUri,
		strings.ToLower(token.Creator.String()),
		token.Metadata.Id,
	)
	if err != nil {
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

func (p *postgres) GetMetadata(ctx context.Context, tx pgx.Tx, metadataId int64) (*domain.TokenMetadata, error) {
	// JOINs are too heavy. Returns [count(tags) * count(attr)] rows
	mdQuery := `
		SELECT name, description, image, hidden_file, category, subcategory
		FROM token_metadata
		WHERE id = $1
	`
	pQuery := `
		SELECT trait_type, display_type, value_type, property_type
		FROM token_metadata_properties
		WHERE metadata_id=$1
	`
	tQuery := `
		SELECT tag
		FROM token_metadata_tags
		WHERE metadata_id=$1
	`

	var metadata domain.TokenMetadata
	metadata.Id = metadataId
	err := tx.QueryRow(ctx, mdQuery, metadataId).Scan(
		&metadata.Name,
		&metadata.Description,
		&metadata.Image,
		&metadata.HiddenFile,
		&metadata.Category,
		&metadata.Subcategory,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to query metadata: %w", err)
	}

	// Properties
	rows, err := tx.Query(ctx, pQuery, metadataId)
	if err != nil {
		return nil, fmt.Errorf("failed to query properties: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var prop domain.MetadataProperty
		var propType string

		if err := rows.Scan(&prop.TraitType, &prop.DisplayType, &prop.Value, &propType); err != nil {
			return nil, err
		}

		switch propType {
		case "attribute":
			metadata.Attributes = append(metadata.Attributes, &prop)
		case "ranking":
			metadata.Rankings = append(metadata.Rankings, &prop)
		case "stat":
			metadata.Stats = append(metadata.Stats, &prop)
		}
	}

	// Tags
	tRows, err := tx.Query(ctx, tQuery, metadataId)
	if err != nil {
		return nil, err
	}
	defer tRows.Close()

	for tRows.Next() {
		var tag string

		if err := tRows.Scan(&tag); err != nil {
			return nil, err
		}

		metadata.Tags = append(metadata.Tags, tag)
	}

	return &metadata, nil
}

func (p *postgres) InsertMetadata(ctx context.Context, tx pgx.Tx, metadata *domain.TokenMetadata) (int64, error) {
	// FIXME: too many separate INSERT statements. Use query builder later
	query := `
		INSERT INTO token_metadata (id, name, description, image, hidden_file, category, subcategory)
		VALUES (DEFAULT,$1,$2,$3,$4,$5,$6)  
		ON CONFLICT ON CONSTRAINT token_metadata_pkey DO NOTHING 
		RETURNING id
	`

	var metadataId int64
	err := tx.QueryRow(
		ctx,
		query,
		metadata.Name,
		metadata.Description,
		metadata.Image,
		metadata.HiddenFile,
		metadata.Category,
		metadata.Subcategory,
	).Scan(&metadataId)
	if err != nil {
		return 0, err
	}

	query = `
		INSERT INTO token_metadata_properties (id, metadata_id, trait_type, display_type, value_type, property_type)
		VALUES (DEFAULT,$1,$2,$3,$4,$5)  
		ON CONFLICT ON CONSTRAINT token_metadata_properties_pkey DO NOTHING
	`
	for _, attr := range metadata.Attributes {
		_, err := tx.Exec(ctx, query, metadataId, attr.TraitType, attr.DisplayType, attr.Value, "attribute")
		if err != nil {
			return 0, err
		}
	}

	for _, stat := range metadata.Stats {
		_, err := tx.Exec(ctx, query, metadataId, stat.TraitType, stat.DisplayType, stat.Value, "stat")
		if err != nil {
			return 0, err
		}
	}

	for _, ranking := range metadata.Rankings {
		_, err := tx.Exec(ctx, query, metadataId, ranking.TraitType, ranking.DisplayType, ranking.Value, "ranking")
		if err != nil {
			return 0, err
		}
	}

	query = `
		INSERT INTO token_metadata_tags (id, metadata_id, tag)
		VALUES (DEFAULT, $1, $2)
		ON CONFLICT ON CONSTRAINT token_metadata_tags_pkey DO NOTHING
	`
	for _, tag := range metadata.Tags {
		_, err := tx.Exec(ctx, query, metadataId, tag)
		if err != nil {
			return 0, err
		}
	}

	return metadataId, nil
}

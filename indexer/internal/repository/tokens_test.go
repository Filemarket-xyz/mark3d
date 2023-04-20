package repository

import (
	"context"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/mark3d-xyz/mark3d/indexer/internal/domain"
	"reflect"
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_postgres_InsertMetadata(t *testing.T) {
	dbPool, err := pgxpool.Connect(context.Background(), "postgres://indexer:1337@localhost:1338/mark3d_indexer")
	if err != nil {
		t.Fatalf("failed to connect to db: %v", err)
	}
	defer dbPool.Close()

	p := &postgres{pg: dbPool}

	ctx := context.Background()

	metadata := &domain.TokenMetadata{
		Id:          0,
		Name:        "test_name",
		Description: "test_description",
		Image:       "test_image",
		HiddenFile:  "test_hidden_file",
		Category:    "test_category",
		Subcategory: "test_subcategory",
		Attributes: []*domain.MetadataProperty{
			{TraitType: "attr_trait_type1", DisplayType: "attr_display_type1", Value: "attr_value1"},
			{TraitType: "attr_trait_type2", DisplayType: "attr_display_type2", Value: "attr_value2"},
		},
		Stats: []*domain.MetadataProperty{
			{TraitType: "stat_trait_type1", DisplayType: "stat_display_type1", Value: "stat_value1"},
			{TraitType: "stat_trait_type2", DisplayType: "stat_display_type2", Value: "stat_value2"},
		},
		Rankings: []*domain.MetadataProperty{
			{TraitType: "rank_trait_type1", DisplayType: "rank_display_type1", Value: "rank_value1"},
			{TraitType: "rank_trait_type2", DisplayType: "rank_display_type2", Value: "rank_value2"},
		},
		Tags: []string{"tag1", "tag2"},
	}

	// Before
	var metadataCountBefore, propertiesCountBefore, tagsCountBefore int
	err = dbPool.QueryRow(ctx, "SELECT COUNT(*) FROM token_metadata").Scan(&metadataCountBefore)
	if err != nil {
		t.Fatalf("failed to query token_metadata count: %v", err)
	}

	err = dbPool.QueryRow(ctx, "SELECT COUNT(*) FROM token_metadata_properties").Scan(&propertiesCountBefore)
	if err != nil {
		t.Fatalf("failed to query token_metadata_properties count: %v", err)
	}

	err = dbPool.QueryRow(ctx, "SELECT COUNT(*) FROM token_metadata_tags").Scan(&tagsCountBefore)
	if err != nil {
		t.Fatalf("failed to query token_metadata_properties count: %v", err)
	}

	// Do
	tx, err := p.pg.Begin(ctx)
	if err != nil {
		t.Fatalf("failed to start transaction: %v", err)
	}
	defer tx.Rollback(ctx)

	metadataId, err := p.InsertMetadata(ctx, tx, metadata)
	if err != nil {
		t.Fatalf("failed to insert metadata: %v", err)
	}

	err = tx.Commit(ctx)
	if err != nil {
		t.Fatalf("failed to commit transaction: %v", err)
	}

	// check that metadata was inserted correctly
	var count int
	err = dbPool.QueryRow(ctx, "SELECT COUNT(*) FROM token_metadata").Scan(&count)
	if err != nil {
		t.Fatalf("failed to query token_metadata count: %v", err)
	}
	assert.Equal(t, metadataCountBefore+1, count)

	err = dbPool.QueryRow(ctx, "SELECT COUNT(*) FROM token_metadata_properties").Scan(&count)
	if err != nil {
		t.Fatalf("failed to query token_metadata_properties count: %v", err)
	}
	assert.Equal(t, propertiesCountBefore+len(metadata.Attributes)+len(metadata.Rankings)+len(metadata.Stats), count)

	err = dbPool.QueryRow(ctx, "SELECT COUNT(*) FROM token_metadata_tags").Scan(&count)
	if err != nil {
		t.Fatalf("failed to query token_metadata_tags count: %v", err)
	}
	assert.Equal(t, tagsCountBefore+len(metadata.Tags), count)

	// Clean up
	if _, err := dbPool.Exec(ctx, "DELETE FROM token_metadata WHERE id=$1", metadataId); err != nil {
		t.Error(err)
	}
}

func Test_postgres_GetMetadata(t *testing.T) {
	dbPool, err := pgxpool.Connect(context.Background(), "postgres://indexer:1337@localhost:1338/mark3d_indexer")
	if err != nil {
		t.Fatalf("failed to connect to db: %v", err)
	}
	defer dbPool.Close()

	p := &postgres{pg: dbPool}

	ctx := context.Background()

	metadata := &domain.TokenMetadata{
		Id:          0,
		Name:        "test_name",
		Description: "test_description",
		Image:       "test_image",
		HiddenFile:  "test_hidden_file",
		Category:    "test_category",
		Subcategory: "test_subcategory",
		Attributes: []*domain.MetadataProperty{
			{TraitType: "attr_trait_type1", DisplayType: "attr_display_type1", Value: "attr_value1"},
			{TraitType: "attr_trait_type2", DisplayType: "attr_display_type2", Value: "attr_value2"},
		},
		Stats: []*domain.MetadataProperty{
			{TraitType: "stat_trait_type1", DisplayType: "stat_display_type1", Value: "stat_value1"},
			{TraitType: "stat_trait_type2", DisplayType: "stat_display_type2", Value: "stat_value2"},
		},
		Rankings: []*domain.MetadataProperty{
			{TraitType: "rank_trait_type1", DisplayType: "rank_display_type1", Value: "rank_value1"},
			{TraitType: "rank_trait_type2", DisplayType: "rank_display_type2", Value: "rank_value2"},
		},
		Tags: []string{"tag1", "tag2"},
	}

	// Before
	tx, err := p.pg.Begin(ctx)
	if err != nil {
		t.Fatalf("failed to start transaction: %v", err)
	}
	defer tx.Rollback(ctx)

	metadataId, err := p.InsertMetadata(ctx, tx, metadata)
	if err != nil {
		t.Fatalf("failed to insert metadata: %v", err)
	}

	// Do
	gotMetadata, err := p.GetMetadata(ctx, tx, metadataId)
	if err != nil {
		t.Fatalf("failed to get metadata: %v", err)
	}

	err = tx.Commit(ctx)
	if err != nil {
		t.Fatalf("failed to commit transaction: %v", err)
	}

	metadata.Id = metadataId
	assert.True(t, reflect.DeepEqual(gotMetadata, metadata))

	// Clean up
	if _, err := dbPool.Exec(ctx, "DELETE FROM token_metadata WHERE id=$1", metadataId); err != nil {
		t.Error(err)
	}
}

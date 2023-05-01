package domain

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/mark3d-xyz/mark3d/indexer/models"
)

type Token struct {
	CollectionAddress common.Address
	CollectionName    string
	TokenId           *big.Int
	Owner             common.Address
	Creator           common.Address
	MetaUri           string
	Metadata          *TokenMetadata
}

func TokenToModel(t *Token) *models.Token {
	return &models.Token{
		Categories:        t.Metadata.Categories,
		CollectionAddress: t.CollectionAddress.String(),
		CollectionName:    t.CollectionName,
		Creator:           t.Creator.String(),
		Description:       t.Metadata.Description,
		ExternalLink:      t.Metadata.ExternalLink,
		HiddenFile:        t.Metadata.HiddenFile,
		HiddenFileMeta: &models.HiddenFileMetaData{
			Name: t.Metadata.HiddenFileMeta.Name,
			Size: t.Metadata.HiddenFileMeta.Size,
			Type: t.Metadata.HiddenFileMeta.Type,
		},
		Image:         t.Metadata.Image,
		License:       t.Metadata.License,
		LicenseURL:    t.Metadata.LicenseUrl,
		MetaURI:       t.MetaUri,
		Name:          t.Metadata.Name,
		Owner:         t.Owner.String(),
		Properties:    MapSlice(t.Metadata.Properties, MetadataPropertyToModel),
		Rankings:      MapSlice(t.Metadata.Rankings, MetadataPropertyToModel),
		Stats:         MapSlice(t.Metadata.Stats, MetadataPropertyToModel),
		Subcategories: t.Metadata.Subcategories,
		Tags:          t.Metadata.Tags,
		TokenID:       t.TokenId.String(),
	}
}

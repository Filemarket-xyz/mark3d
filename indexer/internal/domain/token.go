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
		CollectionAddress: t.CollectionAddress.String(),
		CollectionName:    t.CollectionName,
		Creator:           t.Creator.String(),
		Description:       t.Metadata.Description,
		HiddenFile:        t.Metadata.HiddenFile,
		Image:             t.Metadata.Image,
		MetaURI:           t.MetaUri,
		Name:              t.Metadata.Name,
		Owner:             t.Owner.String(),
		TokenID:           t.TokenId.String(),
		Category:          t.Metadata.Category,
		Subcategory:       t.Metadata.Subcategory,
		Attributes:        MapSlice(t.Metadata.Attributes, MetadataPropertyToModel),
		Rankings:          MapSlice(t.Metadata.Rankings, MetadataPropertyToModel),
		Stats:             MapSlice(t.Metadata.Stats, MetadataPropertyToModel),
		Tags:              t.Metadata.Tags,
	}
}

type TokenMetadata struct {
	Id          int64               `json:"-"`
	Name        string              `json:"name"`
	Description string              `json:"description"`
	Image       string              `json:"image"`
	HiddenFile  string              `json:"hidden_file"`
	Attributes  []*MetadataProperty `json:"attributes"`
	Rankings    []*MetadataProperty `json:"rankings"`
	Stats       []*MetadataProperty `json:"stats"`
	Category    string              `json:"category"`
	Subcategory string              `json:"subcategory"`
	Tags        []string            `json:"tags"`
}

type MetadataProperty struct {
	TraitType   string `json:"traitType"`
	DisplayType string `json:"displayType"`
	Value       string `json:"value"`
}

func MetadataPropertyToModel(mp *MetadataProperty) *models.MetadataProperty {
	return &models.MetadataProperty{
		DisplayType: mp.DisplayType,
		TraitType:   mp.TraitType,
		Value:       mp.Value,
	}
}

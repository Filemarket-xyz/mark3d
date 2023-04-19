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
	Name              string
	Description       string
	Image             string
	HiddenFile        string
}

func TokenToModel(t *Token) *models.Token {
	return &models.Token{
		CollectionAddress: t.CollectionAddress.String(),
		CollectionName:    t.CollectionName,
		Description:       t.Description,
		HiddenFile:        t.HiddenFile,
		Image:             t.Image,
		MetaURI:           t.MetaUri,
		Name:              t.Name,
		Owner:             t.Owner.String(),
		Creator:           t.Creator.String(),
		TokenID:           t.TokenId.String(),
	}
}

package domain

import (
	"github.com/ethereum/go-ethereum/common"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"math/big"
)

type Token struct {
	CollectionAddress common.Address
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
		Collection:  t.CollectionAddress.String(),
		Description: t.Description,
		HiddenFile:  t.HiddenFile,
		Image:       t.Image,
		MetaURI:     t.MetaUri,
		Name:        t.Name,
		Owner:       t.Owner.String(),
		Creator:     t.Creator.String(),
		TokenID:     t.TokenId.String(),
	}
}

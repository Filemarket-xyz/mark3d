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
	MetaUri           string
}

func TokenToModel(t *Token) *models.Token {
	return &models.Token{
		Collection: t.CollectionAddress.String(),
		MetaURI:    t.MetaUri,
		TokenID:    t.TokenId.String(),
		Owner:      t.Owner.String(),
	}
}

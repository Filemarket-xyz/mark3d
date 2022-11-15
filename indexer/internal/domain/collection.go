package domain

import (
	"github.com/ethereum/go-ethereum/common"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"math/big"
)

type Collection struct {
	Address common.Address
	Creator common.Address
	Owner   common.Address
	Name    string
	TokenId *big.Int
	MetaUri string
}

type CollectionTransfer struct {
	Timestamp int64
	From      common.Address
	To        common.Address
}

func CollectionToModel(c *Collection) *models.Collection {
	return &models.Collection{
		Address: c.Address.String(),
		Creator: c.Creator.String(),
		MetaURI: c.MetaUri,
		Name:    c.Name,
		Owner:   c.Owner.String(),
		TokenID: c.TokenId.String(),
	}
}

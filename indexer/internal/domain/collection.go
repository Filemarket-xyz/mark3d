package domain

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/mark3d-xyz/mark3d/indexer/models"
)

type Collection struct {
	Address     common.Address
	Creator     common.Address
	Owner       common.Address
	TokenId     *big.Int
	MetaUri     string
	Name        string
	Description string
	Image       string
	Type        string
}

type CollectionTransfer struct {
	Timestamp int64
	From      common.Address
	To        common.Address
	TxId      common.Hash
}

func CollectionToModel(c *Collection) *models.Collection {
	return &models.Collection{
		Address:     c.Address.String(),
		Creator:     c.Creator.String(),
		MetaURI:     c.MetaUri,
		Owner:       c.Owner.String(),
		TokenID:     c.TokenId.String(),
		Name:        c.Name,
		Description: c.Description,
		Image:       c.Image,
		Type:        c.Type,
	}
}

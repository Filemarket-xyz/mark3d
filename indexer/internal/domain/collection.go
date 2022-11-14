package domain

import (
	"github.com/ethereum/go-ethereum/common"
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

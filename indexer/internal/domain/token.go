package domain

import (
	"github.com/ethereum/go-ethereum/common"
	"math/big"
)

type Token struct {
	CollectionAddress common.Address
	TokenId           *big.Int
	Owner             common.Address
	MetaUri           string
}

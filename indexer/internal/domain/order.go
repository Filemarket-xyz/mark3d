package domain

import (
	"github.com/ethereum/go-ethereum/common"
	"math/big"
)

type Order struct {
	Id         int64
	TransferId int64
	Price      *big.Int
	Statuses   []*OrderStatus
}

type OrderStatus struct {
	Timestamp int64
	Status    string
	TxId      common.Hash
}

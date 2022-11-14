package domain

import (
	"github.com/ethereum/go-ethereum/common"
	"math/big"
)

type Transfer struct {
	Id                int64
	CollectionAddress common.Address
	TokenId           *big.Int
	FromAddress       common.Address
	ToAddress         common.Address
	FraudApproved     bool
	Statuses          []*TransferStatus
}

type TransferStatus struct {
	Timestamp int64
	Status    string
	TxId      common.Hash
}

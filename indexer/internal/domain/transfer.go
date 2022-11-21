package domain

import (
	"github.com/ethereum/go-ethereum/common"
	"github.com/mark3d-xyz/mark3d/indexer/models"
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
	OrderId           int64
	PublicKey         string
	EncryptedPassword string
}

type TransferStatus struct {
	Timestamp int64
	Status    string
	TxId      common.Hash
}

func TransferToModel(t *Transfer) *models.Transfer {
	return &models.Transfer{
		Collection:        t.CollectionAddress.String(),
		FraudApproved:     t.FraudApproved,
		From:              t.FromAddress.String(),
		ID:                t.Id,
		OrderID:           t.OrderId,
		Statuses:          MapSlice(t.Statuses, TransferStatusToModel),
		To:                t.ToAddress.String(),
		TokenID:           t.TokenId.String(),
		PublicKey:         t.PublicKey,
		EncryptedPassword: t.EncryptedPassword,
	}
}

func TransferStatusToModel(s *TransferStatus) *models.TransferStatusInfo {
	return &models.TransferStatusInfo{
		Status:    models.TransferStatus(s.Status),
		Timestamp: s.Timestamp,
		TxID:      s.TxId.String(),
	}
}

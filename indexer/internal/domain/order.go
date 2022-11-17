package domain

import (
	"github.com/ethereum/go-ethereum/common"
	"github.com/mark3d-xyz/mark3d/indexer/models"
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

func OrderToModel(o *Order) *models.Order {
	return &models.Order{
		ID:         o.Id,
		Statuses:   MapSlice(o.Statuses, OrderStatusToModel),
		TransferID: o.TransferId,
		Price:      o.Price.String(),
	}
}

func OrderStatusToModel(s *OrderStatus) *models.OrderStatusInfo {
	return &models.OrderStatusInfo{
		Status:    models.OrderStatus(s.Status),
		Timestamp: s.Timestamp,
		TxID:      s.TxId.String(),
	}
}

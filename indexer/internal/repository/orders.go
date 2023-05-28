package repository

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/jackc/pgx/v4"
	"github.com/mark3d-xyz/mark3d/indexer/internal/domain"
	"math"
	"math/big"
	"strings"
)

// GetAllActiveOrders
// Parameters:
// - lastTransferId: pass `nil` for first page.
func (p *postgres) GetAllActiveOrders(
	ctx context.Context,
	tx pgx.Tx,
	lastOrderId *int64,
	limit int,
) ([]*domain.Order, error) {
	// Returns orders, where the latest order status=='Created' and latest transfer status NOT IN ('Finished', 'Cancelled')
	// language=PostgreSQL
	query := `
		WITH latest_transfer_statuses AS (
			SELECT transfer_id, status, RANK() OVER(PARTITION BY transfer_id ORDER BY timestamp DESC) as rank
			FROM transfer_statuses
		),
		latest_order_statuses AS (
			SELECT order_id, status, timestamp, tx_id, RANK() OVER(PARTITION BY order_id ORDER BY timestamp DESC) as rank
			FROM order_statuses
		),
		filtered_orders AS (
			SELECT o.id, o.transfer_id, o.price
			FROM orders AS o
			JOIN transfers t on o.transfer_id = t.id
			JOIN latest_transfer_statuses lts on lts.transfer_id = t.id
			WHERE lts.rank = 1 
			  AND lts.status NOT IN ('Finished', 'Cancelled') 
			  AND o.id < $1
		)
		SELECT fo.id, fo.transfer_id, fo.price, los.timestamp, los.status, los.tx_id
		FROM filtered_orders fo
		JOIN latest_order_statuses los ON fo.id = los.order_id
		WHERE los.rank = 1 
		  AND los.status = 'Created'
		ORDER BY fo.id DESC
		LIMIT $2
	`

	var lastOrderIdParam int64 = math.MaxInt64
	if lastOrderId != nil {
		lastOrderIdParam = *lastOrderId
	}
	if limit == 0 {
		limit = 10000
	}

	rows, err := tx.Query(ctx, query, lastOrderIdParam, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var (
		res []*domain.Order
		ids []int64
	)
	for rows.Next() {
		var price, txId string
		status := &domain.OrderStatus{}
		o := &domain.Order{
			Statuses: make([]*domain.OrderStatus, 0, 1),
		}

		if err := rows.Scan(
			&o.Id,
			&o.TransferId,
			&price,
			&status.Timestamp,
			&status.Status,
			&txId,
		); err != nil {
			return nil, err
		}

		status.TxId = common.HexToHash(txId)
		o.Statuses = append(o.Statuses, status)

		var ok bool
		o.Price, ok = big.NewInt(0).SetString(price, 10)
		if !ok {
			return nil, fmt.Errorf("failed to parse big int: %s", price)
		}

		res, ids = append(res, o), append(ids, o.Id)
	}

	return res, nil
}

func (p *postgres) GetAllActiveOrdersTotal(
	ctx context.Context,
	tx pgx.Tx,
) (uint64, error) {
	// language=PostgreSQL
	query := `
		WITH latest_transfer_statuses AS (
			SELECT transfer_id, status, RANK() OVER(PARTITION BY transfer_id ORDER BY timestamp DESC) as rank
			FROM transfer_statuses
		),
		latest_order_statuses AS (
			SELECT order_id, status, timestamp, tx_id, RANK() OVER(PARTITION BY order_id ORDER BY timestamp DESC) as rank
			FROM order_statuses
		),
		filtered_orders AS (
			SELECT o.id, o.transfer_id, o.price
			FROM orders AS o
			JOIN transfers t on o.transfer_id = t.id
			JOIN latest_transfer_statuses lts on lts.transfer_id = t.id
			WHERE lts.rank = 1 AND lts.status NOT IN ('Finished', 'Cancelled')
		)
		SELECT COUNT(*) as total
		FROM filtered_orders fo
		JOIN latest_order_statuses los ON fo.id = los.order_id
		WHERE los.rank = 1 AND los.status = 'Created'
		ORDER BY fo.id DESC
	`

	var total uint64
	if err := tx.QueryRow(ctx, query).Scan(&total); err != nil {
		return 0, err
	}
	return total, nil
}

func (p *postgres) GetIncomingOrdersByAddress(
	ctx context.Context,
	tx pgx.Tx,
	address common.Address,
) ([]*domain.Order, error) {
	// language=PostgreSQL
	query := `
		SELECT o.id, o.transfer_id, o.price 
		FROM orders AS o 
    	JOIN transfers t on o.transfer_id = t.id 
		WHERE t.to_address=$1
		ORDER BY o.id DESC
	`

	rows, err := tx.Query(ctx, query, strings.ToLower(address.String()))
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var (
		res []*domain.Order
		ids []int64
	)
	for rows.Next() {
		var price string
		o := &domain.Order{}
		if err := rows.Scan(&o.Id, &o.TransferId, &price); err != nil {
			return nil, err
		}
		var ok bool
		o.Price, ok = big.NewInt(0).SetString(price, 10)
		if !ok {
			return nil, fmt.Errorf("failed to parse big int: %s", price)
		}

		res, ids = append(res, o), append(ids, o.Id)
	}
	statuses, err := p.getOrderStatuses(ctx, tx, ids)
	if err != nil {
		return nil, err
	}
	for _, t := range res {
		t.Statuses = statuses[t.Id]
	}
	return res, nil
}

func (p *postgres) GetOutgoingOrdersByAddress(ctx context.Context, tx pgx.Tx, address common.Address) ([]*domain.Order, error) {
	// language=PostgreSQL
	rows, err := tx.Query(ctx, `SELECT o.id,o.transfer_id,o.price FROM orders AS o 
    	JOIN transfers t on o.transfer_id = t.id WHERE t.from_address=$1 ORDER BY o.id DESC `,
		strings.ToLower(address.String()))
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var (
		res []*domain.Order
		ids []int64
	)
	for rows.Next() {
		var price string
		o := &domain.Order{}
		if err := rows.Scan(&o.Id, &o.TransferId, &price); err != nil {
			return nil, err
		}
		var ok bool
		o.Price, ok = big.NewInt(0).SetString(price, 10)
		if !ok {
			return nil, fmt.Errorf("failed to parse big int: %s", price)
		}

		res, ids = append(res, o), append(ids, o.Id)
	}
	statuses, err := p.getOrderStatuses(ctx, tx, ids)
	if err != nil {
		return nil, err
	}
	for _, t := range res {
		t.Statuses = statuses[t.Id]
	}
	return res, nil
}

func (p *postgres) GetActiveIncomingOrdersByAddress(ctx context.Context, tx pgx.Tx,
	address common.Address) ([]*domain.Order, error) {
	// language=PostgreSQL
	rows, err := tx.Query(ctx, `SELECT o.id,o.transfer_id,o.price FROM orders AS o 
    	JOIN transfers t on o.transfer_id = t.id WHERE t.to_address=$1 AND 
    	    NOT (SELECT ts.status FROM transfer_statuses AS ts WHERE ts.transfer_id=t.id AND 
                ts.timestamp=(SELECT MAX(ts2.timestamp) FROM transfer_statuses AS ts2 WHERE ts2.transfer_id=t.id))=
                    ANY('{Finished,Cancelled}') ORDER BY o.id DESC `, strings.ToLower(address.String()))
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var (
		res []*domain.Order
		ids []int64
	)
	for rows.Next() {
		var price string
		o := &domain.Order{}
		if err := rows.Scan(&o.Id, &o.TransferId, &price); err != nil {
			return nil, err
		}
		var ok bool
		o.Price, ok = big.NewInt(0).SetString(price, 10)
		if !ok {
			return nil, fmt.Errorf("failed to parse big int: %s", price)
		}

		res, ids = append(res, o), append(ids, o.Id)
	}
	statuses, err := p.getOrderStatuses(ctx, tx, ids)
	if err != nil {
		return nil, err
	}
	for _, t := range res {
		t.Statuses = statuses[t.Id]
	}
	return res, nil
}

func (p *postgres) GetActiveOutgoingOrdersByAddress(ctx context.Context, tx pgx.Tx, address common.Address) ([]*domain.Order, error) {
	// language=PostgreSQL
	rows, err := tx.Query(ctx, `SELECT o.id,o.transfer_id,o.price FROM orders AS o 
    	JOIN transfers t on o.transfer_id = t.id WHERE t.from_address=$1 AND
    	    NOT (SELECT ts.status FROM transfer_statuses AS ts WHERE ts.transfer_id=t.id AND 
                ts.timestamp=(SELECT MAX(ts2.timestamp) FROM transfer_statuses AS ts2 WHERE ts2.transfer_id=t.id))=
                    ANY('{Finished,Cancelled}') ORDER BY o.id DESC `, strings.ToLower(address.String()))
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var (
		res []*domain.Order
		ids []int64
	)
	for rows.Next() {
		var price string
		o := &domain.Order{}
		if err := rows.Scan(&o.Id, &o.TransferId, &price); err != nil {
			return nil, err
		}
		var ok bool
		o.Price, ok = big.NewInt(0).SetString(price, 10)
		if !ok {
			return nil, fmt.Errorf("failed to parse big int: %s", price)
		}

		res, ids = append(res, o), append(ids, o.Id)
	}
	statuses, err := p.getOrderStatuses(ctx, tx, ids)
	if err != nil {
		return nil, err
	}
	for _, t := range res {
		t.Statuses = statuses[t.Id]
	}
	return res, nil
}

func (p *postgres) getOrderStatuses(ctx context.Context, tx pgx.Tx,
	ids []int64) (map[int64][]*domain.OrderStatus, error) {
	// language=PostgreSQL
	rows, err := tx.Query(ctx, `SELECT order_id,timestamp,status,tx_id FROM order_statuses 
                                          WHERE order_id=ANY($1) ORDER BY order_id,timestamp DESC`, ids)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	res := make(map[int64][]*domain.OrderStatus, len(ids))
	for rows.Next() {
		var (
			orderId int64
			txId    string
		)
		s := &domain.OrderStatus{}
		if err := rows.Scan(&orderId, &s.Timestamp, &s.Status, &txId); err != nil {
			return nil, err
		}
		s.TxId = common.HexToHash(txId)
		res[orderId] = append(res[orderId], s)
	}
	return res, nil
}

func (p *postgres) GetOrder(ctx context.Context, tx pgx.Tx, id int64) (*domain.Order, error) {
	// language=PostgreSQL
	row := tx.QueryRow(ctx, `SELECT id,transfer_id,price FROM orders WHERE id=$1`, id)

	var price string
	o := &domain.Order{}
	if err := row.Scan(&o.Id, &o.TransferId, &price); err != nil {
		return nil, err
	}
	var ok bool
	o.Price, ok = big.NewInt(0).SetString(price, 10)
	if !ok {
		return nil, fmt.Errorf("failed to parse big int: %s", price)
	}

	statuses, err := p.getOrderStatuses(ctx, tx, []int64{o.Id})
	if err != nil {
		return nil, err
	}
	o.Statuses = statuses[o.Id]
	return o, nil
}

func (p *postgres) GetActiveOrder(ctx context.Context, tx pgx.Tx, contractAddress common.Address, tokenId *big.Int) (*domain.Order, error) {
	// language=PostgreSQL
	row := tx.QueryRow(ctx, `SELECT o.id,o.transfer_id,o.price FROM orders AS o 
    	JOIN transfers t on t.id = o.transfer_id
    	WHERE collection_address=$1 AND token_id=$2 AND
              NOT (SELECT ts.status FROM transfer_statuses AS ts WHERE ts.transfer_id=t.id AND 
                ts.timestamp=(SELECT MAX(ts2.timestamp) FROM transfer_statuses AS ts2 WHERE ts2.transfer_id=t.id))=
                    ANY('{Finished,Cancelled}')`, strings.ToLower(contractAddress.String()), tokenId.String())

	var price string
	o := &domain.Order{}
	if err := row.Scan(&o.Id, &o.TransferId, &price); err != nil {
		return nil, err
	}
	var ok bool
	o.Price, ok = big.NewInt(0).SetString(price, 10)
	if !ok {
		return nil, fmt.Errorf("failed to parse big int: %s", price)
	}

	statuses, err := p.getOrderStatuses(ctx, tx, []int64{o.Id})
	if err != nil {
		return nil, err
	}
	o.Statuses = statuses[o.Id]
	return o, nil
}

func (p *postgres) InsertOrder(ctx context.Context, tx pgx.Tx, order *domain.Order) (int64, error) {
	// language=PostgreSQL
	row := tx.QueryRow(ctx, `INSERT INTO orders VALUES (DEFAULT,$1,$2) RETURNING id`,
		order.TransferId, order.Price.String())
	var id int64
	if err := row.Scan(&id); err != nil {
		return 0, err
	}
	return id, nil
}

func (p *postgres) InsertOrderStatus(ctx context.Context, tx pgx.Tx, orderId int64, status *domain.OrderStatus) error {
	// language=PostgreSQL
	if _, err := tx.Exec(ctx, `INSERT INTO order_statuses VALUES ($1,$2,$3,$4)`,
		orderId, status.Timestamp, status.Status, strings.ToLower(status.TxId.String())); err != nil {
		return err
	}
	return nil
}

func (p *postgres) OrderTxExists(ctx context.Context, tx pgx.Tx, txId common.Hash) (bool, error) {
	// language=PostgreSQL
	row := tx.QueryRow(ctx, `SELECT COUNT(*) FROM order_statuses WHERE lower(tx_id)=$1`, strings.ToLower(txId.Hex()))
	var count int64
	if err := row.Scan(&count); err != nil {
		return false, err
	}
	return count > 0, nil
}

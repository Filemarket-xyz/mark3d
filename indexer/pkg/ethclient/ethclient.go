package ethclient

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/ethereum/go-ethereum/rpc"
	"github.com/sony/gobreaker"
	"log"
	"math/big"
	"strings"
	"time"
)

type EthClient interface {
	BlockByNumber(ctx context.Context, number *big.Int) (*types.Block, error)
	GetLatestBlockNumber(ctx context.Context) (*big.Int, error)
	TransactionReceipt(ctx context.Context, txHash common.Hash) (*types.Receipt, error)
	Clients() []*ethclient.Client
	Shutdown()
}

type ethClient struct {
	urls           []string
	rpcClients     []*rpc.Client
	ethClients     []*ethclient.Client
	breakers       []*gobreaker.CircuitBreaker
	latestFetched  *big.Int
	breakThreshold *big.Int
}

func NewEthClient(urls []string) (EthClient, error) {
	res := &ethClient{
		urls:           urls,
		breakThreshold: big.NewInt(1),
	}
	res.rpcClients = make([]*rpc.Client, len(urls))
	res.ethClients = make([]*ethclient.Client, len(urls))
	res.breakers = make([]*gobreaker.CircuitBreaker, len(urls))
	var err error
	for i, u := range urls {
		res.rpcClients[i], err = rpc.Dial(u)
		if err != nil {
			return nil, err
		}
		res.ethClients[i], err = ethclient.Dial(u)
		if err != nil {
			return nil, err
		}
		res.breakers[i] = gobreaker.NewCircuitBreaker(gobreaker.Settings{
			Name:     fmt.Sprintf("rpc %d %s", i, u),
			Interval: time.Minute,
			Timeout:  time.Minute,
			ReadyToTrip: func(counts gobreaker.Counts) bool {
				return counts.ConsecutiveFailures > 5
			},
		})
	}
	return res, nil
}

func (e *ethClient) BlockByNumber(ctx context.Context, number *big.Int) (*types.Block, error) {
	var err error
	clients := e.Clients()
	if len(clients) == 0 {
		return nil, fmt.Errorf("rpc broken")
	}
	for i, c := range clients {
		var block *types.Block
		block, err = c.BlockByNumber(ctx, number)
		if err != nil {
			log.Println("get pending block failed", number.String(), e.urls[i], err)
			if strings.Contains(err.Error(), "want 512 for Bloom") {
				return nil, err
			}
		} else {
			return block, nil
		}
	}
	return nil, err
}

func (e *ethClient) GetLatestBlockNumber(ctx context.Context) (*big.Int, error) {
	var (
		err error
		max *big.Int
	)
	for i, c := range e.rpcClients {
		var res interface{}
		res, err = e.breakers[i].Execute(func() (interface{}, error) {
			var raw json.RawMessage
			err = c.CallContext(ctx, &raw, "eth_blockNumber")
			if err != nil {
				return nil, fmt.Errorf("get block error %s %w", e.urls[i], err)
			} else if len(raw) != 0 {
				res, err := hexutil.DecodeBig(strings.Trim(string(raw), "\""))
				if err != nil {
					return nil, fmt.Errorf("decode block number failed %s %w", e.urls[i], err)
				}
				if e.latestFetched != nil && big.NewInt(0).Sub(e.latestFetched, res).Cmp(e.breakThreshold) >= 0 {
					return nil, fmt.Errorf("rpc out of sync %s %s %s", e.urls[i], e.latestFetched, res)
				}
				return res, nil
			} else {
				return nil, fmt.Errorf("empty response")
			}
		})
		if err != nil {
			log.Println("get block error", e.urls[i], err)
			continue
		}
		if max == nil || res.(*big.Int).Cmp(max) == 1 {
			max = res.(*big.Int)
		}
	}
	if max != nil {
		e.latestFetched = max
		return max, nil
	}
	return nil, err
}

func (e *ethClient) TransactionReceipt(ctx context.Context, txHash common.Hash) (*types.Receipt, error) {
	var err error
	clients := e.Clients()
	if len(clients) == 0 {
		return nil, fmt.Errorf("rpc broken")
	}
	for i, c := range clients {
		var rec *types.Receipt
		rec, err = c.TransactionReceipt(ctx, txHash)
		if err != nil {
			log.Println("get receipt failed", txHash.String(), e.urls[i], err)
		} else {
			return rec, nil
		}
	}
	return nil, err
}

func (e *ethClient) Clients() []*ethclient.Client {
	var res []*ethclient.Client
	for i, c := range e.ethClients {
		if state := e.breakers[i].State(); state == gobreaker.StateClosed || state == gobreaker.StateHalfOpen {
			res = append(res, c)
		}
	}
	return res
}

func (e *ethClient) Shutdown() {
	for _, c := range e.ethClients {
		c.Close()
	}
	for _, c := range e.rpcClients {
		c.Close()
	}
}

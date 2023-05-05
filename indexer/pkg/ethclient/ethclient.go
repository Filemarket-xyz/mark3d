package ethclient

import (
	"context"
	"encoding/json"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/ethereum/go-ethereum/rpc"
	"log"
	"math/big"
	"strings"
)

type EthClient interface {
	BlockByNumber(ctx context.Context, number *big.Int) (*types.Block, error)
	GetLatestBlockNumber(ctx context.Context) (*big.Int, error)
	TransactionReceipt(ctx context.Context, txHash common.Hash) (*types.Receipt, error)
	Clients() []*ethclient.Client
	Shutdown()
}

type ethClient struct {
	urls       []string
	rpcClients []*rpc.Client
	ethClients []*ethclient.Client
}

func NewEthClient(urls []string) (EthClient, error) {
	res := &ethClient{
		urls: urls,
	}
	res.rpcClients = make([]*rpc.Client, len(urls))
	res.ethClients = make([]*ethclient.Client, len(urls))
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
	}
	return res, nil
}

func (e *ethClient) BlockByNumber(ctx context.Context, number *big.Int) (*types.Block, error) {
	var err error
	for i, c := range e.ethClients {
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
		var raw json.RawMessage
		err = c.CallContext(ctx, &raw, "eth_blockNumber")
		if err != nil {
			log.Println("get block error", e.urls[i], err)
		} else if len(raw) != 0 {
			res, err := hexutil.DecodeBig(strings.Trim(string(raw), "\""))
			if err != nil {
				log.Println("decode block number failed", e.urls[i], err)
			} else {
				if max == nil || res.Cmp(max) == 1 {
					max = res
				}
			}
		}
	}
	if max != nil {
		return max, nil
	}
	return nil, err
}

func (e *ethClient) TransactionReceipt(ctx context.Context, txHash common.Hash) (*types.Receipt, error) {
	var err error
	for i, c := range e.ethClients {
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
	return e.ethClients
}

func (e *ethClient) Shutdown() {
	for _, c := range e.ethClients {
		c.Close()
	}
	for _, c := range e.rpcClients {
		c.Close()
	}
}

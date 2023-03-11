package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/rpc"
	"log"
	"math/big"
	"strings"
)

func getLatestBlockNumber(ctx context.Context, rpcClient *rpc.Client) (*big.Int, error) {
	var raw json.RawMessage
	err := rpcClient.CallContext(ctx, &raw, "eth_blockNumber")
	if err != nil {
		log.Println("get block error", err)
		return nil, err
	} else if len(raw) == 0 {
		return nil, ethereum.NotFound
	}
	return hexutil.DecodeBig(strings.Trim(string(raw), "\""))
}

func main() {
	var url string
	flag.StringVar(&url, "url", "", "")
	flag.Parse()

	c, err := rpc.Dial(url)
	if err != nil {
		log.Panicln(err)
	}
	b, err := getLatestBlockNumber(context.Background(), c)
	if err != nil {
		log.Panicln(err)
	}
	fmt.Println(b)
}

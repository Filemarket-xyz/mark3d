package main

import (
	"context"
	"flag"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/ethclient"
	"log"
)

func main() {
	var url, hash string
	flag.StringVar(&url, "url", "", "")
	flag.StringVar(&hash, "hash", "", "")
	flag.Parse()

	c, err := ethclient.Dial(url)
	if err != nil {
		log.Panicln(err)
	}
	h, err := hexutil.Decode(hash)
	if err != nil {
		log.Panicln(err)
	}
	res, err := c.TransactionReceipt(context.Background(), common.BytesToHash(h))
	if err != nil {
		log.Panicln(err)
	}
	fmt.Println(res.Status, res.TxHash, len(res.Logs))
}

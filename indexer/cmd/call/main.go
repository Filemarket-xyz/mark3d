package main

import (
	"flag"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/mark3d-xyz/mark3d/indexer/contracts/exchange"
	"log"
	"math/big"
)

func main() {
	var url, address string
	flag.StringVar(&url, "url", "", "")
	flag.StringVar(&address, "address", "", "")
	flag.Parse()

	c, err := ethclient.Dial(url)
	if err != nil {
		log.Panicln(err)
	}
	e, err := exchange.NewMark3dExchange(common.HexToAddress(address), c)
	if err != nil {
		log.Panicln(err)
	}
	res, err := e.Orders(nil, common.HexToAddress(address), big.NewInt(0))
	if err != nil {
		log.Panicln(err)
	}
	fmt.Println(res)
}

package main

import (
	"context"
	"flag"
	"fmt"
	"github.com/ethereum/go-ethereum/ethclient"
	"log"
	"math/big"
)

func main() {
	var url string
	flag.StringVar(&url, "url", "", "")
	flag.Parse()

	c, err := ethclient.Dial(url)
	if err != nil {
		log.Panicln(err)
	}
	b, err := c.BlockByNumber(context.Background(), big.NewInt(156853))
	if err != nil {
		log.Panicln(err)
	}
	fmt.Println(b)
	for _, t := range b.Transactions() {
		fmt.Println(t, t.Hash())
		if t.To() != nil {
			fmt.Println(*t.To())
		}
	}
}

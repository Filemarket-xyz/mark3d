package main

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/ethclient"
	"log"
)

func main() {
	client, err := ethclient.Dial("https://api.hyperspace.node.glif.io/rpc/v1")
	if err != nil {
		log.Panicln(err)
	}
	defer client.Close()
	block, err := client.BlockByNumber(context.Background(), nil)
	if err != nil {
		log.Panicln(err)
	}
	fmt.Printf("%+v\n", block)
}

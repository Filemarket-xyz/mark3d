package main

import (
	"flag"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/mark3d-xyz/mark3d/indexer/contracts/access_token"
	ethclient2 "github.com/mark3d-xyz/mark3d/indexer/pkg/ethclient"
	"log"
	"math/big"
)

func main() {
	var address, url string
	flag.StringVar(&address, "address", "", "")
	flag.StringVar(&url, "url", "", "")
	flag.Parse()

	c, err := ethclient2.NewEthClient([]string{url})
	if err != nil {
		log.Panicln(err)
	}
	accessTokenInstance, err := access_token.NewMark3dAccessToken(common.HexToAddress(address), c.Clients()[0])
	if err != nil {
		log.Panicln(err)
	}
	fmt.Println(accessTokenInstance.TokenURI(nil, big.NewInt(0)))
}

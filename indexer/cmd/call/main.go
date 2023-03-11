package main

import (
	"context"
	"flag"
	"fmt"
	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/mark3d-xyz/mark3d/indexer/contracts/exchange"
	"log"
	"math/big"
	"strings"
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
	_ = e
	to := common.HexToAddress(address)
	a, err := abi.JSON(strings.NewReader(exchange.Mark3dExchangeABI))
	if err != nil {
		log.Panicln(err)
	}
	for m, d := range a.Methods {
		fmt.Println(m, d.ID)
	}
	pubKey, err := hexutil.Decode("0x2d2d2d2d2d424547494e205055424c4943204b45592d2d2d2d2d0a4d494942496a414e42676b71686b6947397730424151454641414f43415138414d49494243674b434151454130654138795456595459734b523245493756552f6764434137364e585a74595868436357626433465839375a543462484c366369614468586c314b69484842344769696e48676b694d786472363332363045526c336c734a4b394f306c6f464b424d6e47536f4b3563716f734a366b71364c593770354c6f6f4b61634672472b69584e397752356b62596475436e503466736b7153426b306634795659567265766d4b726969554e30432b71514358705a2b45393970687067546d3033455a776d46657949695144576763596278784561435248516e734f64474171536738504546564968456a384b6c594d4449484f3262627637323877795434486e42636b65366a424239685136475a594a6b384d35324f6f54453946527a4e73385979382b55476b593533796c764f77513647713034375574342f766a68764568544649307872433947726d33334e6e376b626a6b39514b51514944415141420a2d2d2d2d2d454e44205055424c4943204b45592d2d2d2d2d")
	if err != nil {
		log.Panicln(err)
	}
	data, err := a.Pack("fulfillOrder", common.HexToAddress("0xf9b0C5C3360A6537aDb105e31887772fD21425B9"), pubKey, big.NewInt(0))
	if err != nil {
		log.Panicln(err)
	}
	res, err := c.CallContract(context.Background(), ethereum.CallMsg{
		From:      common.HexToAddress("0xDFF36657b42D806Eb4E69ff416604e2C30eF35B4"),
		To:        &to,
		Gas:       10000000000000000,
		GasPrice:  big.NewInt(10000000000000000),
		GasFeeCap: big.NewInt(10000000000000000),
		GasTipCap: big.NewInt(10000000000000000),
		Value:     big.NewInt(10000000000000000),
		Data:      data,
	}, big.NewInt(
		53200))
	fmt.Println(res, err)
	order, err := e.Orders(&bind.CallOpts{
		BlockNumber: big.NewInt(
			90476 - 1),
	}, common.HexToAddress("0xf9b0C5C3360A6537aDb105e31887772fD21425B9"), big.NewInt(0))
	fmt.Println(order, err)
	//tx, _, err := c.TransactionByHash(context.Background(), common.HexToHash("0x61a225e812e4881dca3a84cf0f9cbf40f22bc4de476bf386a1353c3540fe1469"))
	//if err != nil {
	//	log.Panicln(err)
	//}
	//fmt.Println(*tx.To())
	//fmt.Println(hexutil.Encode(tx.Data()))
	blk, err := c.BlockByNumber(context.Background(), big.NewInt(53201))
	if err != nil {
		log.Panicln(err)
	}
	fmt.Println(blk)
	for _, t := range blk.Transactions() {
		if t.To() != nil && *t.To() == common.HexToAddress(address) {
			fmt.Println("yeah")
		}
	}
}

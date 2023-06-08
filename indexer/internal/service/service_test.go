package service

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/mark3d-xyz/mark3d/indexer/internal/config"
	"github.com/mark3d-xyz/mark3d/indexer/pkg/ethclient"
	"github.com/mark3d-xyz/mark3d/indexer/pkg/log"
	"math/big"
	"testing"
)

func Test_service_getRoyalty(t *testing.T) {
	client, err := ethclient.NewEthClient([]string{"https://filecoin-calibration.chainup.net/rpc/v1"})
	if err != nil {
		logger.WithFields(log.Fields{"error": err}).Fatal("failed to init eth client", nil)
	}
	service := &service{
		ethClient: client,
		cfg: &config.ServiceConfig{
			PublicCollectionAddress: common.HexToAddress("0xc8c4d9daf70fb945a1a53ac1d977303836df425e"),
		},
	}
	got, err := service.getRoyalty(context.TODO(), big.NewInt(627322), common.HexToAddress("0xc8c4d9daf70fb945a1a53ac1d977303836df425e"), big.NewInt(949821))

	fmt.Printf("%#v, %#v\n", got.String(), err)
}

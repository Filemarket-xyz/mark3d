package ethsigner

import (
	"crypto/ecdsa"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
)

type EthSigner struct {
	privateKey *ecdsa.PrivateKey
}

func NewEthSigner(privateKeyHex string) (*EthSigner, error) {
	privateKey, err := crypto.HexToECDSA(privateKeyHex)
	if err != nil {
		return nil, fmt.Errorf("failed to convert private key: %v", err)
	}
	return &EthSigner{privateKey: privateKey}, nil
}

func (s *EthSigner) SignAddress(address common.Address) ([]byte, error) {
	data := make([]byte, 32)
	copy(data[12:], address[:])

	hash := crypto.Keccak256([]byte(fmt.Sprintf("\x19Ethereum Signed Message:\n%d%s", 32, string(data))))
	signature, err := crypto.Sign(hash, s.privateKey)
	if err != nil {
		return nil, fmt.Errorf("failed to sign message: %v", err)
	}

	// recovery id
	if signature[len(signature)-1] < 5 {
		signature[len(signature)-1] += 27
	}

	return signature, nil
}

package rsa

import (
	"crypto"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha512"
	"errors"
)

const ModulusLen = 4096

var sha512Hash = sha512.New() // Reuse hash

// Generate rsa.PrivateKey based on ModulusLen const
func GenKey() (*rsa.PrivateKey, error) {
	privateKey, err := rsa.GenerateKey(rand.Reader, ModulusLen)
	if err != nil {
		return nil, err
	}

	return privateKey, nil
}

func Encrypt(data []byte, publicKey *rsa.PublicKey, label []byte) ([]byte, error) {
	if publicKey == nil {
		return nil, errors.New("Public key wasn't provided")
	}
	if data == nil || len(data) == 0 {
		return nil, errors.New("Data is empty or nil")
	}

	encrypted, err := rsa.EncryptOAEP(sha512Hash, rand.Reader, publicKey, data, label)
	if err != nil {
		return nil, err
	}
	return encrypted, nil
}

func Decrypt(data []byte, privateKey *rsa.PrivateKey, label []byte) ([]byte, error) {
	if privateKey == nil {
		return nil, errors.New("Private key wasn't provided")
	}
	if data == nil || len(data) == 0 {
		return nil, errors.New("Data is empty or nil")
	}

	decrypted, err := privateKey.Decrypt(rand.Reader, data, &rsa.OAEPOptions{
		Hash:  crypto.SHA512,
		Label: label,
	})
	if err != nil {
		return nil, err
	}

	return decrypted, nil
}

package rsa

import (
	"crypto"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha512"
	"crypto/x509"
	"encoding/base64"
	"encoding/hex"
	"encoding/pem"
	"errors"
	"fmt"
	"log"
)

const ModulusLen = 4096

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

	var sha512Hash = sha512.New()
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
func GetPublicKeyFromHex(hexKey string) (*rsa.PublicKey, error) {
	var err error
	bytes, err := hex.DecodeString(hexKey)
	if err != nil {
		return nil, fmt.Errorf("failed to decode hex string to bytes: %w", err)
	}
	base64Key := base64.StdEncoding.EncodeToString(bytes)
	publicKeyBlock, _ := pem.Decode([]byte("-----BEGIN PUBLIC KEY-----\n" + base64Key + "\n-----END PUBLIC KEY-----"))
	var parsedKey any
	if parsedKey, err = x509.ParsePKIXPublicKey(publicKeyBlock.Bytes); err != nil {
		return nil, fmt.Errorf("unable to parse RSA public key: %w", err.Error())
	}
	publicKey, ok := parsedKey.(*rsa.PublicKey)
	if !ok {
		log.Println("Unable to parse RSA public key")
		return nil, fmt.Errorf("unable to cast to public key")
	}

	return publicKey, nil
}

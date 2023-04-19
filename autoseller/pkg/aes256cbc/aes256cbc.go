package aes256cbc

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha512"
	"errors"
)

func VerifyFileIntegrity(fileData, key []byte) (bool, error) {
	_, err := DecryptFile(fileData, key)
	if err != nil {
		return false, err
	}
	return true, nil
}

// Encrypts file data
// `iv(16b) | SHA512(64b) | encData`
func EncryptFile(fileData, key, iv []byte) ([]byte, error) {
	hash := sha512.Sum512(fileData)

	encryptedData, err := EncryptAES256CBCPadded(fileData, key, iv)
	if err != nil {
		return nil, err
	}

	return append(append(iv, hash[:]...), encryptedData...), nil
}

// Decrypts file data
// `iv(16b) | SHA512(64b) | encData`
func DecryptFile(fileData, key []byte) ([]byte, error) {
	var (
		ivPadding   = 16
		hashPadding = 64

		iv   = fileData[:ivPadding]
		hash = fileData[ivPadding : hashPadding+ivPadding]
		data = fileData[hashPadding+ivPadding:]
	)

	decrypted, err := DecryptAES256CBCPadded(data, key, iv)
	if err != nil {
		return nil, err
	}

	recalculatedHash := sha512.Sum512(decrypted)
	if !bytes.Equal(hash, recalculatedHash[:]) {
		return nil, errors.New("Hashes do not match")
	}

	return decrypted, nil
}

func DecryptAES256CBCPadded(data, key, iv []byte) ([]byte, error) {
	cipherBlock, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	decrypted := make([]byte, len(data))
	decrypter := cipher.NewCBCDecrypter(cipherBlock, iv)
	decrypter.CryptBlocks(decrypted, data)

	padLength := int(decrypted[len(decrypted)-1])
	if padLength > aes.BlockSize || padLength > len(decrypted) {
		return nil, errors.New("Invalid padding length")
	}
	decrypted = decrypted[:len(decrypted)-padLength]

	return decrypted, nil
}

func EncryptAES256CBCPadded(data, key, iv []byte) ([]byte, error) {
	cipherBlock, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	paddingLen := aes.BlockSize - (len(data) % aes.BlockSize)
	padding := make([]byte, paddingLen)
	for i := range padding {
		padding[i] = byte(paddingLen)
	}
	paddedData := append(data, padding...)

	encrypted := make([]byte, len(paddedData))
	encrypter := cipher.NewCBCEncrypter(cipherBlock, iv)
	encrypter.CryptBlocks(encrypted, paddedData)

	return encrypted, nil
}

func GenAESKey() ([]byte, error) {
	key, err := randomBytes(32)
	if err != nil {
		return nil, err
	}

	return key, nil
}

func GenIV() ([]byte, error) {
	iv, err := randomBytes(16)
	if err != nil {
		return nil, err
	}

	return iv, nil
}

func randomBytes(len int) ([]byte, error) {
	b := make([]byte, len)
	if _, err := rand.Read(b); err != nil {
		return nil, err
	}

	return b, nil
}

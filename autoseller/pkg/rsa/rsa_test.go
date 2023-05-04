package rsa

import (
	"bytes"
	"crypto/rsa"
	"testing"
)

func Test_Encrypt(t *testing.T) {
	privateKey, err := GenKey()
	if err != nil {
		t.Fatalf("Failed to generate private key: %v", err)
	}

	testCases := []struct {
		name      string
		data      []byte
		publicKey *rsa.PublicKey
		label     []byte
		wantErr   bool
	}{
		{
			name:      "Valid input",
			data:      []byte("hello world"),
			publicKey: &privateKey.PublicKey,
			label:     []byte("test label"),
			wantErr:   false,
		},
		{
			name:      "Empty input",
			data:      []byte{},
			publicKey: &privateKey.PublicKey,
			label:     nil,
			wantErr:   true,
		},
		{
			name:      "Nil public key",
			data:      []byte("hello world"),
			publicKey: nil,
			label:     nil,
			wantErr:   true,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			encrypted, err := Encrypt(tc.data, tc.publicKey, tc.label)
			if err != nil && !tc.wantErr {
				t.Fatalf("Encrypt() error = %v, wantErr %v", err, tc.wantErr)
			}

			if !tc.wantErr && len(encrypted) == 0 {
				t.Fatalf("Encrypt() produced empty output")
			}
		})
	}
}

func Test_Decrypt(t *testing.T) {
	privateKey, err := GenKey()
	if err != nil {
		t.Fatalf("Failed to generate private key: %v", err)
	}

	plaintext := []byte("hello world")
	label := []byte("test label")

	encrypted, err := Encrypt(plaintext, &privateKey.PublicKey, label)
	if err != nil {
		t.Fatalf("Failed to encrypt: %v", err)
	}

	testCases := []struct {
		name       string
		data       []byte
		privateKey *rsa.PrivateKey
		label      []byte
		want       []byte
		wantErr    bool
	}{
		{
			name:       "Valid input",
			data:       encrypted,
			privateKey: privateKey,
			label:      label,
			want:       plaintext,
			wantErr:    false,
		},
		{
			name:       "Empty input",
			data:       []byte{},
			privateKey: privateKey,
			label:      nil,
			want:       []byte{},
			wantErr:    true,
		},
		{
			name:       "Nil private key",
			data:       encrypted,
			privateKey: nil,
			label:      nil,
			want:       nil,
			wantErr:    true,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			decrypted, err := Decrypt(tc.data, tc.privateKey, tc.label)
			if err != nil && !tc.wantErr {
				t.Fatalf("Decrypt() error = %v, wantErr %v", err, tc.wantErr)
			}

			if !tc.wantErr && !bytes.Equal(decrypted, tc.want) {
				t.Fatalf("Data does not match")
			}
		})
	}
}

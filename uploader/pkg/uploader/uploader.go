package uploader

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/filemarket-xyz/file-market/autoseller/pkg/aes256cbc"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"time"
)

type FileInfo struct {
	Name string
	Hash string
	Size string
	Key  string // base64 representation
}

type Uploader interface {
	UploadArchive(r io.Reader) (*FileInfo, error)
	UploadMetadata(r io.Reader) (*FileInfo, error)
	Upload(r io.Reader) (*FileInfo, error)
	Encrypt(r io.Reader) (io.Reader, []byte, error)
}

type LighthouseUploader struct {
	Token string
}

func (u *LighthouseUploader) Encrypt(r io.Reader) (io.Reader, []byte, error) {
	archBytes, err := io.ReadAll(r)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to read file: %w", err)
	}
	key, err := aes256cbc.GenAESKey()
	if err != nil {
		return nil, nil, fmt.Errorf("failed to generate AES key: %w", err)
	}
	iv, err := aes256cbc.GenIV()
	if err != nil {
		return nil, nil, fmt.Errorf("failed to generate IV: %w", err)
	}
	encryptedBytes, err := aes256cbc.EncryptFile(archBytes, key, iv)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to encrypt file: %w", err)
	}

	return bytes.NewReader(encryptedBytes), key, nil
}

func (u *LighthouseUploader) UploadArchive(r io.Reader) (*FileInfo, error) {
	return u.upload(r, "application/x-rar-compressed", "bunny.rar")
}

func (u *LighthouseUploader) UploadMetadata(r io.Reader) (*FileInfo, error) {
	return u.upload(r, "text/plain", "metadata")
}

func (u *LighthouseUploader) UploadImage(r io.Reader) (*FileInfo, error) {
	return u.upload(r, "image/png", "image")
}

// Needed only for tests now
func DownloadAndDecrypt(info FileInfo) {
	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("https://gateway.lighthouse.storage/ipfs/%s", info.Hash), nil)
	if err != nil {
		log.Fatal(err)
	}
	getResp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Fatal()
	}
	defer getResp.Body.Close()
	data, err := io.ReadAll(getResp.Body)
	if err != nil {
		log.Panicln(err)
	}
	keyDec, err := base64.StdEncoding.DecodeString(info.Key)
	if err != nil {
		log.Fatal(err)
	}
	decData, err := aes256cbc.DecryptFile(data, keyDec)
	if err != nil {
		log.Fatal(err)
	}
	if err := os.WriteFile(info.Name, decData, 0777); err != nil {
		log.Fatal(err)
	}
}

func (u *LighthouseUploader) upload(r io.Reader, mime string, filename string) (*FileInfo, error) {
	var b bytes.Buffer
	w := multipart.NewWriter(&b)
	fw, err := w.CreateFormFile("file", filename)
	if err != nil {
		return nil, err
	}
	if _, err := io.Copy(fw, r); err != nil {
		return nil, err
	}
	if err := w.Close(); err != nil {
		return nil, err
	}
	req, err := http.NewRequest(http.MethodPost, "https://node.lighthouse.storage/api/v0/add", &b)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", u.Token))
	req.Header.Set("Content-Type", w.FormDataContentType())
	req.Header.Set("Encryption", "false")
	req.Header.Set("Mime-Type", mime)

	start := time.Now()
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	fmt.Println("upload res", string(data), "time to execute", time.Now().Sub(start).Milliseconds())

	fileInfo := &FileInfo{}
	if err = json.Unmarshal(data, fileInfo); err != nil {
		return nil, err
	}

	return fileInfo, nil
}

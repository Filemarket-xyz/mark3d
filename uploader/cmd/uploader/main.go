package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"flag"
	"fmt"
	"github.com/filemarket-xyz/file-market/uploader/pkg/csv"
	"github.com/filemarket-xyz/file-market/uploader/pkg/uploader"
	"log"
	"os"
	"path/filepath"
	"strconv"
)

type Metadata struct {
	Name           string         `json:"name"`
	Description    string         `json:"description"`
	Image          string         `json:"image"`
	ExternalLink   string         `json:"external_link"`
	HiddenFile     string         `json:"hidden_file"`
	HiddenFileMeta HiddenFileMeta `json:"hidden_file_meta"`
	Categories     []string       `json:"categories"`
	Subcategories  []string       `json:"subcategories"`
	Tags           []string       `json:"tags"`
}

type HiddenFileMeta struct {
	Name string `json:"name"`
	Type string `json:"type"`
	Size int64  `json:"size"`
}

func main() {
	token := os.Getenv("TOKEN")
	if token == "" {
		log.Fatal("empty TOKEN")
	}
	var imgsPath, metaPath string
	flag.StringVar(&imgsPath, "imgs-path", "", "")
	flag.StringVar(&metaPath, "meta-path", "", "")
	flag.Parse()

	var ss = make([]csv.CidKeyInfo, 0)

	lighthouseUploader := uploader.LighthouseUploader{
		Token: token,
	}

	imgs, err := os.ReadDir(imgsPath)
	if err != nil {
		log.Fatal(err)
	}
	for _, img := range imgs {
		path := filepath.Join(imgsPath, img.Name())
		imgBytes, err := os.ReadFile(path)
		if err != nil {
			log.Fatal(err)
		}
		imgFileInfo, err := lighthouseUploader.UploadImage(bytes.NewReader(imgBytes))
		if err != nil {
			log.Fatal(err)
		}

		fmt.Println("Image: ", imgFileInfo)

		f, err := os.Open(path)
		if err != nil {
			log.Panicln(err)
		}
		encryptedReader, key, err := lighthouseUploader.Encrypt(f)
		if err != nil {
			log.Fatal(err)
		}

		if err := f.Close(); err != nil {
			log.Fatal(err)
		}

		fileInfo, err := lighthouseUploader.UploadArchive(encryptedReader)
		if err != nil {
			log.Fatal(err)
		}
		fileInfo.Key = base64.StdEncoding.EncodeToString(key)

		fmt.Printf("Archive: %#v\n", *fileInfo)

		fileSize, err := strconv.ParseInt(fileInfo.Size, 10, 64)
		if err != nil {
			log.Fatal("failed to parse fileSize")
		}
		meta := Metadata{
			Name:         img.Name(),
			Description:  imgFileInfo.Name,
			Image:        fmt.Sprintf("ipfs://%s", imgFileInfo.Hash),
			ExternalLink: "https://filemarket.xyz/",
			HiddenFile:   fmt.Sprintf("ipfs://%s", fileInfo.Hash),
			HiddenFileMeta: HiddenFileMeta{
				Name: fileInfo.Name,
				Type: "rar",
				Size: fileSize,
			},
			Categories:    nil,
			Subcategories: nil,
			Tags:          nil,
		}

		b, err := json.Marshal(meta)
		if err != nil {
			log.Fatal(err)
		}
		metaInfo, err := lighthouseUploader.UploadMetadata(bytes.NewReader(b))

		fmt.Println("Metadata: ", metaInfo)

		ss = append(ss, csv.CidKeyInfo{
			Name: img.Name(),
			Cid:  fmt.Sprintf("ipfs://%s", metaInfo.Hash),
			Key:  fileInfo.Key,
		})
		fmt.Println("--------------------------")
	}

	err = csv.WriteToCsv(ss, "keys.csv")
	if err != nil {
		log.Fatal(err)
	}
}

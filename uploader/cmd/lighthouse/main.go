package main

import (
	"bytes"
	"flag"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"time"
)

func main() {
	var token, path string
	flag.StringVar(&token, "token", "", "")
	flag.StringVar(&path, "path", "", "")
	flag.Parse()

	f, err := os.Open(path)
	if err != nil {
		log.Panicln(err)
	}
	defer f.Close()

	var b bytes.Buffer
	w := multipart.NewWriter(&b)
	fw, err := w.CreateFormFile("file", "bunnie.rar")
	if err != nil {
		log.Panicln(err)
	}
	if _, err := io.Copy(fw, f); err != nil {
		log.Panicln(err)
	}
	if err := w.Close(); err != nil {
		log.Panicln(err)
	}

	req, err := http.NewRequest(http.MethodPost, "https://node.lighthouse.storage/api/v0/add", &b)
	if err != nil {
		log.Panicln(err)
	}
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	req.Header.Set("Content-Type", w.FormDataContentType())
	req.Header.Set("Encryption", "false")
	req.Header.Set("Mime-Type", "application/x-rar-compressed")

	start := time.Now()
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Panicln(err)
	}
	defer resp.Body.Close()
	data, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Panicln(err)
	}
	fmt.Println("upload res", string(data), "time to execute", time.Now().Sub(start).Milliseconds())
}

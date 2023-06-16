package main

import (
	"context"
	as "github.com/filemarket-xyz/file-market/autoseller/internal/autoseller"
	"github.com/joho/godotenv"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	err := godotenv.Load()
	if err != nil {
		log.Fatal("failed to load .env")
	}
	autoseller := as.New()
	ticker := time.NewTicker(autoseller.Cfg.Interval)

	log.Println("Start listening...")

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGTERM, syscall.SIGINT)

	var processing bool
	var quitRequested bool

loop:
	for {
		select {
		case <-ticker.C:
			processing = true

			start := time.Now()
			if err := autoseller.ProcessTimers(context.Background()); err != nil {
				log.Println("failed to process timers: ", err)
			}
			processed, err := autoseller.Process(context.Background())
			if err != nil {
				log.Println("failed to process response: ", err)
			}
			if processed > 0 {
				log.Println("Processed successfully. Took: ", time.Now().Sub(start).String())
			}
			processing = false

			if quitRequested {
				log.Println("Quit requested, ending after processing.")
				break loop
			}
		case <-quit:
			if processing {
				log.Println("Received quit signal, waiting for current processing to finish...")
				quitRequested = true
			} else {
				log.Println("Received quit signal, quitting immediately.")
				ticker.Stop()
				break loop
			}
		}
	}
}

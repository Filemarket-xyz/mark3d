package main

import (
	"context"
	as "github.com/filemarket-xyz/file-market/autoseller/internal/autoseller"
	"github.com/joho/godotenv"
	"log"
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
	for {
		select {
		case <-ticker.C:
			start := time.Now()
			if err := autoseller.ProcessTimers(context.Background()); err != nil {
				log.Println("failed to process timers: ", err)
			}
			processed, err := autoseller.Process()
			if err != nil {
				log.Println("failed to process response: ", err)
			}
			if processed > 0 {
				log.Println("Processed successfully. Took: ", time.Now().Sub(start).String())
			}
		}
	}

	ticker.Stop()
}

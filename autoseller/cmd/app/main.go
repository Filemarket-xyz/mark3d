package main

import (
	"context"
	as "github.com/filemarket-xyz/file-market/autoseller/internal/autoseller"
	"log"
	"time"
)

// TODO: switch csv package on push

func main() {
	autoseller := as.New()
	ticker := time.NewTicker(autoseller.Cfg.Interval)

	for {
		select {
		case <-ticker.C:
			if err := autoseller.ProcessTimers(context.Background()); err != nil {
				log.Println("failed to process timers: ", err)
			}
			if err := autoseller.Process(); err != nil {
				log.Println("failed to process response: ", err)
			}
		}
	}

	ticker.Stop()
}

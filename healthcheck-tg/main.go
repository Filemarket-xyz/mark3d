package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	tgapi "github.com/go-telegram-bot-api/telegram-bot-api"
)

func main() {
	cfg := GetConfig()

	bot, err := tgapi.NewBotAPI(cfg.Token)
	if err != nil {
		log.Fatal(err)
	}

	bot.Debug = cfg.Debug

	server := listenToHealthReports(bot, cfg)
	shut := make(chan os.Signal, 1)
	signal.Notify(shut, syscall.SIGTERM, syscall.SIGINT)

	log.Printf("Starting bot %s... on port %s", bot.Self.UserName, cfg.Port)

	<-shut

	log.Println("Shutting down...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server shutdown failed: %v", err)
	}
}

func listenToHealthReports(bot *tgapi.BotAPI, cfg *Config) *http.Server {
	mux := http.NewServeMux()
	mux.HandleFunc("/notify", func(w http.ResponseWriter, r *http.Request) {
		logMessage, err := io.ReadAll(r.Body)
		if r != nil {
			defer r.Body.Close()
		}
		if err != nil {
			http.Error(w, "Invalid log message", http.StatusBadRequest)
			return
		}

		msgText := fmt.Sprintf("Indexer is feeling sick\\! An error occurred:\n```\n%s\n```", logMessage)
		for _, chatID := range cfg.ChatIDs {
			msg := tgapi.NewMessage(chatID, msgText)
			msg.ParseMode = "MarkdownV2"
			if _, err := bot.Send(msg); err != nil {
				log.Println("send healthcheck msg failed", err)
			}
		}

		w.WriteHeader(http.StatusOK)
	})

	server := &http.Server{
		Addr:    cfg.Port,
		Handler: mux,
	}

	go func() {
		if err := server.ListenAndServe(); err != http.ErrServerClosed {
			log.Fatalf("HTTP server failed %v", err)
		}
	}()

	return server
}

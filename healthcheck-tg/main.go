package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"log"
	"net"
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
	signal.Notify(shut, os.Interrupt, syscall.SIGTERM)

	log.Printf("Starting bot %s... on port %s", bot.Self.UserName, cfg.Port)

	u := tgapi.NewUpdate(0)
	u.Timeout = cfg.UpdateInterval
	updates, _ := bot.GetUpdatesChan(u)

loop:
	for {
		select {
		case update := <-updates:
			if update.Message == nil {
				continue
			}
			// process messages
		case <-shut:
			break loop
		}
	}

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
		ip, _, err := net.SplitHostPort(r.RemoteAddr)
		if err != nil {
			http.Error(w, "Invalid remote address", http.StatusBadRequest)
			return
		}

		if !isIPAllowed(ip, cfg.AllowedIPs) {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// chatIDStr := r.URL.Query().Get("chat_id")
		// chatID, err := strconv.ParseInt(chatIDStr, 10, 64)
		// if err != nil {
		// 	http.Error(w, "Invalid `chat_id`", http.StatusBadRequest)
		// 	return
		// }

		logMessage, err := ioutil.ReadAll(r.Body)
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
			bot.Send(msg)
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

// Check if the IP is localhost or in the allowed list
func isIPAllowed(ip string, allowedIPs []string) bool {
	if ip == "127.0.0.1" || ip == "::1" {
		return true
	}

	for _, allowedIP := range allowedIPs {
		if ip == allowedIP {
			return true
		}
	}

	return false
}

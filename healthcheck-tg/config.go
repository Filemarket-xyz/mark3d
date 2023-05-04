package main

import (
	"log"
	"os"
	"strconv"
	"strings"
	"sync"

	"github.com/joho/godotenv"
	"golang.org/x/exp/slices"
)

var (
	config     *Config
	configOnce sync.Once
)

type Config struct {
	Token          string
	Port           string
	UpdateInterval int
	Debug          bool
	AllowedIPs     []string
	ChatIDs        []int64
}

func GetConfig() *Config {
	configOnce.Do(func() {
		err := godotenv.Load()
		if err != nil {
			log.Fatal("Failed loading .env")
		}

		updateInterval, err := strconv.Atoi(os.Getenv("UPDATE_INTERVAL"))
		if err != nil {
			log.Fatal("UPDATE_INTERVAL variable should be integer")
		}

		allowedIPs := strings.Split(os.Getenv("ALLOWED_IPS"), ",")
		if slices.Contains(allowedIPs, "") {
			allowedIPs = []string{}
		}

		chatIDsStr := strings.Split(os.Getenv("CHAT_IDs"), ",")
		chatIDs := make([]int64, len(chatIDsStr))
		for i, chatID := range chatIDsStr {
			integer, err := strconv.ParseInt(chatID, 10, 64)
			if err != nil {
				log.Fatal("Failed parse CHAT_IDs env variable")
			}
			chatIDs[i] = integer
		}
		if len(chatIDs) == 0 {
			log.Fatal("CHAT_IPS list is empty")
		}

		config = &Config{
			Token:          os.Getenv("BOT_TOKEN"),
			Port:           os.Getenv("PORT"),
			UpdateInterval: updateInterval,
			Debug:          strings.ToLower(os.Getenv("DEBUG")) == "true",
			AllowedIPs:     allowedIPs,
			ChatIDs:        chatIDs,
		}
	})
	return config
}

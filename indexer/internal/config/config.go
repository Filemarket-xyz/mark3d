package config

import (
	"fmt"
	"path/filepath"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
)

type (
	Config struct {
		Postgres  *PostgresConfig
		Server    *ServerConfig
		Handler   *HandlerConfig
		Service   *ServiceConfig
		Redis     *RedisConfig
		Sequencer *SequencerConfig
	}

	SequencerConfig struct {
		KeyPrefix  string
		TokenIdTTL time.Duration
	}

	PostgresConfig struct {
		Host     string
		User     string
		Password string
		DBName   string
		Port     int
	}

	ServerConfig struct {
		Port           int
		ReadTimeout    time.Duration
		WriteTimeout   time.Duration
		MaxHeaderBytes int
	}

	HandlerConfig struct {
		RequestTimeout time.Duration
		SwaggerHost    string
	}

	ServiceConfig struct {
		RpcUrls                      []string
		AccessTokenAddress           common.Address
		ExchangeAddress              common.Address
		PublicCollectionAddress      common.Address
		FraudDeciderWeb2Address      common.Address
		AllowedBlockNumberDifference int64
		TelegramHealthNotifierAddr   string
		HealthCheckInterval          int
		Mode                         string
	}

	RedisConfig struct {
		Addr     string
		Password string
	}
)

func Init(configPath string) (*Config, error) {
	jsonCfg := viper.New()
	jsonCfg.AddConfigPath(filepath.Dir(configPath))
	jsonCfg.SetConfigName(filepath.Base(configPath))

	if err := jsonCfg.ReadInConfig(); err != nil {
		return nil, err
	}

	envCfg := viper.New()
	envCfg.SetConfigFile(".env")

	if err := envCfg.ReadInConfig(); err != nil {
		return nil, err
	}

	return &Config{
		Postgres: &PostgresConfig{
			Host:     envCfg.GetString("POSTGRES_HOST"),
			User:     envCfg.GetString("POSTGRES_USER"),
			Password: envCfg.GetString("POSTGRES_PASSWORD"),
			DBName:   envCfg.GetString("POSTGRES_DBNAME"),
			Port:     envCfg.GetInt("POSTGRES_PORT"),
		},
		Server: &ServerConfig{
			Port:           jsonCfg.GetInt("server.port"),
			ReadTimeout:    jsonCfg.GetDuration("server.readTimeout"),
			WriteTimeout:   jsonCfg.GetDuration("server.writeTimeout"),
			MaxHeaderBytes: jsonCfg.GetInt("server.maxHeaderBytes"),
		},
		Handler: &HandlerConfig{
			RequestTimeout: jsonCfg.GetDuration("handler.requestTimeout"),
			SwaggerHost:    jsonCfg.GetString("handler.swaggerHost"),
		},
		Service: &ServiceConfig{
			RpcUrls:                      envCfg.GetStringSlice("RPC_URLS"),
			AccessTokenAddress:           common.HexToAddress(jsonCfg.GetString("service.accessTokenAddress")),
			FraudDeciderWeb2Address:      common.HexToAddress(jsonCfg.GetString("service.fraudDeciderWeb2Address")),
			ExchangeAddress:              common.HexToAddress(jsonCfg.GetString("service.exchangeAddress")),
			PublicCollectionAddress:      common.HexToAddress(jsonCfg.GetString("service.publicCollectionAddress")),
			AllowedBlockNumberDifference: jsonCfg.GetInt64("service.allowedBlockNumberDifference"),
			TelegramHealthNotifierAddr:   envCfg.GetString("TELEGRAM_HEALTH_NOTIFIER_ADDRESS"),
			HealthCheckInterval:          jsonCfg.GetInt("service.healthCheckInterval"),
			Mode:                         jsonCfg.GetString("service.mode"),
		},
		Redis: &RedisConfig{
			Addr:     envCfg.GetString("REDIS_ADDRESS"),
			Password: envCfg.GetString("REDIS_PASSWORD"),
		},
		Sequencer: &SequencerConfig{
			KeyPrefix:  jsonCfg.GetString("service.sequencer.keyPrefix"),
			TokenIdTTL: jsonCfg.GetDuration("service.sequencer.tokenIdTTL"),
		},
	}, nil
}

func (p *PostgresConfig) PgSource() string {
	return fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		p.Host, p.Port, p.User, p.Password, p.DBName)
}

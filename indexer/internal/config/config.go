package config

import (
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/spf13/viper"
	"path/filepath"
	"time"
)

type (
	Config struct {
		Postgres *PostgresConfig
		Server   *ServerConfig
		Handler  *HandlerConfig
		Service  *ServiceConfig
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
		RpcUrl             string
		AccessTokenAddress common.Address
		ExchangeAddress    common.Address
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
			RpcUrl:             envCfg.GetString("RPC_URL"),
			AccessTokenAddress: common.HexToAddress(jsonCfg.GetString("service.accessTokenAddress")),
		},
	}, nil
}

func (p *PostgresConfig) PgSource() string {
	return fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		p.Host, p.Port, p.User, p.Password, p.DBName)
}

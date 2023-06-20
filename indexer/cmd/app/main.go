package main

import (
	"context"
	"flag"
	"fmt"
	"github.com/mark3d-xyz/mark3d/indexer/internal/service/realtime_notification"
	"github.com/mark3d-xyz/mark3d/indexer/pkg/currencyconversion"
	"github.com/mark3d-xyz/mark3d/indexer/pkg/ethsigner"
	log "github.com/mark3d-xyz/mark3d/indexer/pkg/log"
	"github.com/mark3d-xyz/mark3d/indexer/pkg/sequencer"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/mark3d-xyz/mark3d/indexer/internal/config"
	"github.com/mark3d-xyz/mark3d/indexer/internal/handler"
	"github.com/mark3d-xyz/mark3d/indexer/internal/repository"
	"github.com/mark3d-xyz/mark3d/indexer/internal/server"
	"github.com/mark3d-xyz/mark3d/indexer/internal/service"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"github.com/mark3d-xyz/mark3d/indexer/pkg/ethclient"
	healthnotifier "github.com/mark3d-xyz/mark3d/indexer/pkg/health_notifier"
)

var logger = log.GetLogger()

func main() {
	var cfgPath string
	flag.StringVar(&cfgPath, "cfg", "configs/local", "config path")
	flag.Parse()

	// initializing config, basically sets values from yml configs and env into a struct
	cfg, err := config.Init(cfgPath)
	if err != nil {
		logger.WithFields(log.Fields{"error": err}).Fatal("failed to init config", nil)
	}

	ctx := context.Background()

	pool, err := pgxpool.Connect(ctx, cfg.Postgres.PgSource())
	if err != nil {
		logger.WithFields(log.Fields{"error": err}).Fatal("failed to connect to pg", nil)
	}
	if err := pool.Ping(ctx); err != nil {
		logger.WithFields(log.Fields{"error": err}).Fatal("failed to ping pg", nil)
	}
	rdb := redis.NewClient(&redis.Options{
		Addr:     cfg.Redis.Addr,
		Password: cfg.Redis.Password,
	})

	client, err := ethclient.NewEthClient(cfg.Service.RpcUrls)
	if err != nil {
		logger.WithFields(log.Fields{"error": err}).Fatal("failed to init eth client", nil)
	}

	healthNotifier := &healthnotifier.TelegramHealthNotifier{
		Addr: cfg.Service.TelegramHealthNotifierAddr,
	}

	sequencerCfg := &sequencer.Config{
		KeyPrefix:     cfg.Sequencer.KeyPrefix,
		TokenIdTTL:    cfg.Sequencer.TokenIdTTL,
		CheckInterval: cfg.Sequencer.CheckInterval,
	}
	pubCollectionAddr := strings.ToLower(cfg.Service.PublicCollectionAddress.String())
	fileBunniesAddr := strings.ToLower(cfg.Service.FileBunniesCollectionAddress.String())
	seq := sequencer.New(sequencerCfg, rdb, map[string]sequencer.Range{
		pubCollectionAddr:                           {0, 1_000_000},
		fmt.Sprintf("%s.common", fileBunniesAddr):   {0, 1000},
		fmt.Sprintf("%s.uncommon", fileBunniesAddr): {6000, 7000},
		fmt.Sprintf("%s.payed", fileBunniesAddr):    {7000, 8000},
	})

	repositoryCfg := &repository.Config{
		PublicCollectionAddress:      cfg.Service.PublicCollectionAddress,
		FileBunniesCollectionAddress: cfg.Service.FileBunniesCollectionAddress,
	}

	currencyConverter := currencyconversion.NewCoinMarketCapProvider(cfg.Service.CoinMarketCapApiKey)
	cacheTTL, err := time.ParseDuration(cfg.Service.CurrencyConversionCacheTTL)
	if err != nil {
		logger.WithFields(log.Fields{"error": err}).Fatal("failed to parse `CurrencyConversionCacheTTL` to time.Duration", nil)
	}
	currencyConverterCache := currencyconversion.NewRedisExchangeRateCache(currencyConverter, rdb, cacheTTL)

	commonSigner, err := ethsigner.NewEthSigner(cfg.Service.CommonSignerKey)
	if err != nil {
		logger.Fatal("failed to create commonSigner", log.Fields{"error": err})
	}
	uncommonSigner, err := ethsigner.NewEthSigner(cfg.Service.UncommonSignerKey)
	if err != nil {
		logger.Fatal("failed to create uncommonSigner", log.Fields{"error": err})
	}

	realtimeNotificationService := realtime_notification.New()

	indexService, err := service.NewService(
		repository.NewRepository(pool, rdb, repositoryCfg),
		client,
		realtimeNotificationService,
		seq,
		healthNotifier,
		currencyConverterCache,
		commonSigner,
		uncommonSigner,
		cfg.Service,
	) // service who interact with main dependencies
	if err != nil {
		logger.WithFields(log.Fields{"error": err}).Fatal("failed to create service", nil)
	}
	indexHandler := handler.NewHandler(cfg.Handler, indexService, realtimeNotificationService) // handler who interact with a service and hashManager
	router := indexHandler.Init()                                                              // gorilla mux here
	srv := server.NewServer(cfg.Server, router)                                                // basically http.Server with config here

	// goroutine in which server running
	go func() {
		if err = srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.WithFields(log.Fields{"error": err}).Fatal("http server error", nil)
		}
	}()

	logger.Infof("server listening on port %d\n", cfg.Server.Port)

	// graceful shutdown here
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGTERM, syscall.SIGINT)
	go func() {
		if err := indexService.ListenBlockchain(); err != service.ErrSubFailed {
			logger.WithFields(log.Fields{"error": err}).Fatal("ListenBlockchain failed", nil)
		}
		quit <- syscall.SIGTERM
	}()

	go func() {
		// Healthcheck every `cfg.Service.HealthCheckInterval` Seconds.
		// Send notification only if returns error or status is not Healthy
		ticker := time.NewTicker(time.Duration(cfg.Service.HealthCheckInterval) * time.Second)
	loop:
		for {
			select {
			case <-ticker.C:
				ctx := context.Background()
				resp, err := indexService.HealthCheck(ctx)
				if err != nil {
					err := healthNotifier.Notify(ctx, fmt.Sprintf("%v", err))
					if err != nil {
						logger.WithFields(log.Fields{"error": err}).Fatal("failed to send healthcheck", nil)
					}
					return
				}
				if resp.Status != models.HealthStatusHealthy {
					err := healthNotifier.Notify(ctx, fmt.Sprintf("%v", *resp))
					if err != nil {
						logger.Error("Failed to send health notification", err, nil)
					}
				}
			case <-quit:
				ticker.Stop()
				break loop
			}
		}
	}()

	<-quit

	if err = srv.Shutdown(ctx); err != nil {
		logger.WithFields(log.Fields{"error": err}).Fatal("failed to shutdown server", nil)
	}
	indexService.Shutdown()

	logger.Info("server shutdown", nil)

	if err := logger.Flush(); err != nil {
		logger.WithFields(log.Fields{"error": err}).Fatal("failed to flush logger", nil)
	}
	pool.Close()
}

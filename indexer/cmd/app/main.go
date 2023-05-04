package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
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

func main() {
	log.SetFlags(log.Lshortfile | log.Ldate | log.Ltime)
	var cfgPath string
	flag.StringVar(&cfgPath, "cfg", "configs/local", "config path")
	flag.Parse()

	// initializing config, basically sets values from yml configs and env into a struct
	cfg, err := config.Init(cfgPath)
	if err != nil {
		log.Panicln(err)
	}

	ctx := context.Background()

	pool, err := pgxpool.Connect(ctx, cfg.Postgres.PgSource())
	if err != nil {
		log.Panicln(err)
	}
	if err := pool.Ping(ctx); err != nil {
		log.Panicln(err)
	}
	rdb := redis.NewClient(&redis.Options{
		Addr:     cfg.Redis.Addr,
		Password: cfg.Redis.Password,
	})

	client, err := ethclient.NewEthClient(cfg.Service.RpcUrls)
	if err != nil {
		log.Panicln(err)
	}

	healthNotifier := &healthnotifier.TelegramHealthNotifier{
		Addr: cfg.Service.TelegramHealthNotifierAddr,
	}

	indexService, err := service.NewService(
		repository.NewRepository(pool, rdb),
		client,
		healthNotifier,
		cfg.Service,
	) // service who interact with main dependencies
	if err != nil {
		log.Panicln(err)
	}
	indexHandler := handler.NewHandler(cfg.Handler, indexService) // handler who interact with a service and hashManager
	router := indexHandler.Init()                                 // gorilla mux here
	srv := server.NewServer(cfg.Server, router)                   // basically http.Server with config here

	// goroutine in which server running
	go func() {
		if err = srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Panicln(err)
		}
	}()

	log.Printf("server listening on port %d\n", cfg.Server.Port)

	// graceful shutdown here
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGTERM, syscall.SIGINT)
	go func() {
		if err := indexService.ListenBlockchain(); err != service.ErrSubFailed {
			log.Panicln(err)
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
						log.Printf("Falied to send health notification %v", err)
					}
				}
				if resp.Status != models.HealthStatusHealthy {
					err := healthNotifier.Notify(ctx, fmt.Sprintf("%v", *resp))
					if err != nil {
						log.Printf("Falied to send health notification %v", err)
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
		log.Panicln(err)
	}
	indexService.Shutdown()

	log.Println("server shutdown")

	pool.Close()
}

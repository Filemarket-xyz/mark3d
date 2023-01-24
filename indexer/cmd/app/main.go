package main

import (
	"context"
	"flag"
	"github.com/ethereum/go-ethereum/rpc"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/mark3d-xyz/mark3d/indexer/internal/config"
	"github.com/mark3d-xyz/mark3d/indexer/internal/handler"
	"github.com/mark3d-xyz/mark3d/indexer/internal/postgres"
	"github.com/mark3d-xyz/mark3d/indexer/internal/server"
	"github.com/mark3d-xyz/mark3d/indexer/internal/service"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
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

	pg := postgres.NewPostgres(pool)
	rpcClient, err := rpc.Dial(cfg.Service.RpcUrl)
	if err != nil {
		log.Panicln(err)
	}
	indexService, err := service.NewService(pg, rpcClient, cfg.Service) // service who interact with main dependencies
	if err != nil {
		log.Panicln(err)
	}
	indexHandler := handler.NewHandler(cfg.Handler, indexService) // handler who interact with a service and hashManager
	router := indexHandler.Init()                                 // gorilla mux here
	srv := server.NewServer(cfg.Server, router)                   // basically http.Server with config here

	// goroutine in which server running
	go func() {
		if err = srv.ListenAndServe(); err != http.ErrServerClosed {
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

	<-quit

	if err = srv.Shutdown(ctx); err != nil {
		log.Panicln(err)
	}
	indexService.Shutdown()

	log.Println("server shutdown")

	pool.Close()
}

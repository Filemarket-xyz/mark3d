package handler

import (
	"github.com/gorilla/mux"
	"github.com/mark3d-xyz/mark3d/indexer/internal/config"
	"github.com/mark3d-xyz/mark3d/indexer/internal/service"
	"net/http"
)

type Handler interface {
	Init() http.Handler
}

type handler struct {
	cfg     *config.HandlerConfig
	service service.Service
}

func NewHandler(cfg *config.HandlerConfig, service service.Service) Handler {
	return &handler{
		cfg:     cfg,
		service: service,
	}
}

func (h *handler) corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", h.cfg.SwaggerHost)
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		w.Header().Set("Access-Control-Allow-Methods", "*")
		next.ServeHTTP(w, r)
	})
}

func (h *handler) Init() http.Handler {
	router := mux.NewRouter()

	router.HandleFunc("/tokens/{address:0x[0-9a-f-A-F]{40}}", h.handleGetTokens)
	router.HandleFunc("/transfers/{address:0x[0-9a-f-A-F]{40}}", h.handleGetActiveTransfers)
	router.HandleFunc("/transfers_history/{address:0x[0-9a-f-A-F]{40}}", h.handleGetTransfersHistory)
	router.HandleFunc("/orders/{address:0x[0-9a-f-A-F]{40}}", h.handleGetActiveOrders)
	router.HandleFunc("/orders_history/{address:0x[0-9a-f-A-F]{40}}", h.handleGetOrdersHistory)
	router.Use(h.corsMiddleware)

	return router
}

package handler

import (
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

func (h *handler) Init() http.Handler {

}

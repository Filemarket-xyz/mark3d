package handler

import (
	"context"
	"github.com/ethereum/go-ethereum/common"
	"github.com/gorilla/mux"
	"net/http"
)

func (h *handler) handleGetActiveTransfers(w http.ResponseWriter, r *http.Request) {
	address := mux.Vars(r)["address"]
	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()
	tokens, e := h.service.GetTransfers(ctx, common.HexToAddress(address))
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}
	sendResponse(w, 200, tokens)
}

func (h *handler) handleGetTransfersHistory(w http.ResponseWriter, r *http.Request) {
	address := mux.Vars(r)["address"]
	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()
	tokens, e := h.service.GetTransfersHistory(ctx, common.HexToAddress(address))
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}
	sendResponse(w, 200, tokens)
}

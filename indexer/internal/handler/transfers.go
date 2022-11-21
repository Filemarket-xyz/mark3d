package handler

import (
	"context"
	"github.com/ethereum/go-ethereum/common"
	"github.com/gorilla/mux"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"math/big"
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

func (h *handler) handleGetTransfer(w http.ResponseWriter, r *http.Request) {
	address := mux.Vars(r)["address"]
	id, ok := big.NewInt(0).SetString(mux.Vars(r)["id"], 10)
	if !ok {
		sendResponse(w, 400, &models.ErrorResponse{
			Code:    400,
			Detail:  "",
			Message: "parse id failed",
		})
		return
	}
	transfer, e := h.service.GetTransfer(r.Context(), common.HexToAddress(address), id)
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}
	sendResponse(w, 200, transfer)
}

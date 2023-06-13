package handler

import (
	"context"
	"github.com/ethereum/go-ethereum/common"
	"github.com/gorilla/mux"
	"net/http"
)

func (h *handler) handleSequencerAcquire(w http.ResponseWriter, r *http.Request) {
	address := mux.Vars(r)["address"]
	suffix := r.URL.Query().Get("suffix")
	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	tokenId, e := h.service.SequencerAcquire(ctx, common.HexToAddress(address), suffix)
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}
	sendResponse(w, 200, tokenId)
}

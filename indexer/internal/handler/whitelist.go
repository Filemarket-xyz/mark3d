package handler

import (
	"context"
	"github.com/ethereum/go-ethereum/common"
	"github.com/gorilla/mux"
	"net/http"
	"strings"
)

func (h *handler) handleGetAddressInWhitelist(w http.ResponseWriter, r *http.Request) {
	address := mux.Vars(r)["address"]

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	whitelist, e := h.service.AddressInWhitelist(ctx, common.HexToAddress(address))
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}
	sendResponse(w, 200, whitelist)
}

func (h *handler) handleGetWhitelistSignature(w http.ResponseWriter, r *http.Request) {
	address := mux.Vars(r)["address"]
	rarity := mux.Vars(r)["rarity"]

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	signature, e := h.service.GetWhitelistSignature(ctx, strings.ToLower(rarity), common.HexToAddress(address))
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}
	sendResponse(w, 200, signature)
}

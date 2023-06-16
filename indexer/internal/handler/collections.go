package handler

import (
	"context"
	"github.com/ethereum/go-ethereum/common"
	"github.com/gorilla/mux"
	"net/http"
)

func (h *handler) handleGetCollection(w http.ResponseWriter, r *http.Request) {
	address := mux.Vars(r)["address"]
	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()
	collection, e := h.service.GetCollection(ctx, common.HexToAddress(address))
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}
	sendResponse(w, 200, collection)
}

func (h *handler) handleGetFullCollection(w http.ResponseWriter, r *http.Request) {
	address := mux.Vars(r)["address"]
	lastTokenId, err := parseLastTokenIdParam(r)
	if err != nil {
		sendResponse(w, err.Code, err)
		return
	}
	limit, err := parseLimitParam(r, "limit", 10000, 10000)
	if err != nil {
		sendResponse(w, err.Code, err)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	res, e := h.service.GetCollectionWithTokens(ctx, common.HexToAddress(address), lastTokenId, limit)
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}
	sendResponse(w, 200, res)
}

func (h *handler) handleGetFullPublicCollection(w http.ResponseWriter, r *http.Request) {
	lastTokenId, err := parseLastTokenIdParam(r)
	if err != nil {
		sendResponse(w, err.Code, err)
		return
	}
	limit, err := parseLimitParam(r, "limit", 10000, 10000)
	if err != nil {
		sendResponse(w, err.Code, err)
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()
	res, e := h.service.GetPublicCollectionWithTokens(ctx, lastTokenId, limit)
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}
	sendResponse(w, 200, res)
}

func (h *handler) handleGetFullFileBunniesCollection(w http.ResponseWriter, r *http.Request) {
	lastTokenId, err := parseLastTokenIdParam(r)
	if err != nil {
		sendResponse(w, err.Code, err)
		return
	}
	limit, err := parseLimitParam(r, "limit", 10000, 10000)
	if err != nil {
		sendResponse(w, err.Code, err)
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()
	res, e := h.service.GetFileBunniesCollectionWithTokens(ctx, lastTokenId, limit)
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}
	sendResponse(w, 200, res)
}

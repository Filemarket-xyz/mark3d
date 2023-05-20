package handler

import (
	"context"
	"math/big"
	"net/http"

	"github.com/ethereum/go-ethereum/common"
	"github.com/gorilla/mux"
	"github.com/mark3d-xyz/mark3d/indexer/models"
)

func (h *handler) handleGetToken(w http.ResponseWriter, r *http.Request) {
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
	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()
	token, e := h.service.GetToken(ctx, common.HexToAddress(address), id)
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}
	sendResponse(w, 200, token)
}

func (h *handler) handleGetTokenEncryptedPassword(w http.ResponseWriter, r *http.Request) {
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
	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	encryptedPassword, err := h.service.GetTokenEncryptedPassword(ctx, common.HexToAddress(address), id)
	if err != nil {
		sendResponse(w, err.Code, err)
		return
	}
	sendResponse(w, 200, encryptedPassword)
}

func (h *handler) handleGetCollectionTokens(w http.ResponseWriter, r *http.Request) {
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
	tokens, e := h.service.GetCollectionTokens(ctx, common.HexToAddress(address), lastTokenId, limit)
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}
	sendResponse(w, 200, tokens)
}

func (h *handler) handleGetTokens(w http.ResponseWriter, r *http.Request) {
	address := mux.Vars(r)["address"]

	lastCollectionAddress := parseCommonAddressParam(r, "lastCollectionAddress")
	collectionLimit, err := parseLimitParam(r, "collectionLimit", 10000, 10000)
	if err != nil {
		sendResponse(w, err.Code, err)
		return
	}
	lastTokenId, err := parseLastTokenIdParam(r)
	if err != nil {
		sendResponse(w, err.Code, err)
		return
	}
	lastTokenCollectionAddress := parseCommonAddressParam(r, "lastTokenCollectionAddress")
	tokenLimit, err := parseLimitParam(r, "tokenLimit", 10000, 10000)
	if err != nil {
		sendResponse(w, err.Code, err)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), h.cfg.RequestTimeout)
	defer cancel()

	tokens, e := h.service.GetTokensByAddress(
		ctx,
		common.HexToAddress(address),
		lastCollectionAddress,
		collectionLimit,
		lastTokenCollectionAddress,
		lastTokenId,
		tokenLimit,
	)
	if e != nil {
		sendResponse(w, e.Code, e)
		return
	}
	sendResponse(w, 200, tokens)
}

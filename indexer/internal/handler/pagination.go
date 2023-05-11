package handler

import (
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/mark3d-xyz/mark3d/indexer/models"
	"math/big"
	"net/http"
	"strconv"
)

func parseLimitParam(r *http.Request, key string, defaultValue, maxValue int) (int, *models.ErrorResponse) {
	limitStr := r.URL.Query().Get(key)

	limit := defaultValue
	if limitStr != "" {
		var err error
		limit, err = strconv.Atoi(limitStr)
		if err != nil {
			return 0, &models.ErrorResponse{
				Code:    http.StatusBadRequest,
				Detail:  "",
				Message: fmt.Sprintf("'%s' must be an integer", key),
			}
		}
	}

	if limit < 1 {
		return 0, &models.ErrorResponse{
			Code:    http.StatusBadRequest,
			Detail:  "",
			Message: fmt.Sprintf("'%s' must be greater then 0", key),
		}
	}

	if limit > maxValue {
		limit = maxValue
	}

	return limit, nil
}

func parseLastTokenIdParam(r *http.Request) (*big.Int, *models.ErrorResponse) {
	lastTokenIdStr := r.URL.Query().Get("lastTokenId")

	lastTokenId := big.NewInt(0)
	if lastTokenIdStr != "" {
		var ok bool
		lastTokenId, ok = lastTokenId.SetString(lastTokenIdStr, 10)
		if !ok {
			return nil, &models.ErrorResponse{
				Code:    http.StatusBadRequest,
				Message: "'lastTokenId' must be an integer",
			}
		}
	}
	return lastTokenId, nil
}

func parseInt64Param(r *http.Request, key string) (*int64, *models.ErrorResponse) {
	paramStr := r.URL.Query().Get(key)

	var param = new(int64)
	if paramStr != "" {
		var err error
		*param, err = strconv.ParseInt(paramStr, 10, 64)
		if err != nil {
			return nil, &models.ErrorResponse{
				Code:    http.StatusBadRequest,
				Detail:  "",
				Message: fmt.Sprintf("'%s' must be an integer", key),
			}
		}
	} else {
		return nil, nil
	}

	return param, nil
}

func parseCommonAddressParam(r *http.Request, key string) *common.Address {
	param := r.URL.Query().Get(key)

	var address = new(common.Address)
	if param != "" {
		*address = common.HexToAddress(param)
	} else {
		return nil
	}

	return address
}

package service

import "github.com/mark3d-xyz/mark3d/indexer/models"

var (
	internalError = &models.ErrorResponse{
		Code:    500,
		Detail:  "internal error",
		Message: "",
	}
)

package service

import "github.com/mark3d-xyz/mark3d/indexer/models"

var (
	collectionNotExistError = &models.ErrorResponse{
		Code:    400,
		Detail:  "",
		Message: "collection doesn't exist",
	}
	tokenNotExistError = &models.ErrorResponse{
		Code:    0,
		Detail:  "",
		Message: "token doesn't exist",
	}
	internalError = &models.ErrorResponse{
		Code:    500,
		Detail:  "",
		Message: "internal error",
	}
)

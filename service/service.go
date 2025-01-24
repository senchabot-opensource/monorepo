package service

import (
	"context"
)

type Service interface {
	GetCustomVariableContent(ctx context.Context, botPlatformId string, varName string) string
}

package gosenchabot

import (
	"context"

	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

type CommandService interface {
	GetBotCommand(ctx context.Context, commandName string, twitchChannelId string) (*models.BotCommand, error)
	CheckCommandExists(ctx context.Context, commandName string, twitchChannelId string) (*string, error)

	CreateBotCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string, createdBy string) (*string, error)
	UpdateBotCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string, updatedBy string) (*string, *string, error)
	DeleteBotCommand(ctx context.Context, commandName string, twitchChannelId string) (*string, *string, error)

	GetCommandList(ctx context.Context, twitchChannelId string) ([]*models.BotCommand, error)

	// COMMAND ALIAS
	GetCommandAlias(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error)
	CheckCommandAliasExist(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error)

	CreateCommandAlias(ctx context.Context, commandName string, aliases []string, twitchChannelId string, createdBy string) (*string, error)
	DeleteCommandAlias(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error)
}

type commandservice struct {
}

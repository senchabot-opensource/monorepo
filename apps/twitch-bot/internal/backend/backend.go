package backend

import (
	"context"

	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/models"
)

type Backend interface {
	GetTwitchChannels(ctx context.Context) ([]*models.TwitchChannel, error)
	CreateTwitchChannel(ctx context.Context, channelId string, channelName string, userId *string) (bool, error)

	GetTwitchBotConfig(ctx context.Context, twitchChannelId string, configName string) (*models.TwitchBotConfig, error)

	GetBotCommand(ctx context.Context, commandName string, twitchChannelId string) (*models.BotCommand, error)
	CreateBotCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string, createdBy string) (bool, error)
	UpdateBotCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string, updatedBy string) error
	DeleteBotCommand(ctx context.Context, commandName string, twitchChannelId string) error

	CreateBotActionActivity(ctx context.Context, botPlatformType string, botActivity string, twitchChannelId string, commandAuthor string) error
}

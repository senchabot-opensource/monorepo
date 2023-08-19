package database

import (
	"context"

	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

type Database interface {
	GetTwitchChannels(ctx context.Context) ([]*models.TwitchChannel, error)
	CreateTwitchChannel(ctx context.Context, channelId string, channelName string, userId *string) (bool, error)

	GetTwitchBotConfig(ctx context.Context, twitchChannelId string, configKey string) (*models.TwitchBotConfig, error)
	CheckConfig(ctx context.Context, twitchChannelId string, configKey string, configValue string) bool

	GetGlobalBotCommand(ctx context.Context, commandName string) (*models.BotCommand, error)
	GetUserBotCommand(ctx context.Context, commandName string, twitchChannelId string) (*models.BotCommand, error)
	CreateBotCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string, createdBy string) (*string, error)
	CheckCommandExists(ctx context.Context, commandName string, twitchChannelId string) (*string, error)
	CheckGlobalCommandExists(ctx context.Context, commandName string) (*string, error)
	CheckUserCommandExists(ctx context.Context, commandName string, twitchChannelId string) (*string, error)
	UpdateBotCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string, updatedBy string) (*string, *string, error)
	DeleteBotCommand(ctx context.Context, commandName string, twitchChannelId string) (*string, *string, error)
	GetCommandList(ctx context.Context, twitchChannelId string) ([]*models.BotCommand, error)

	CreateBotActionActivity(ctx context.Context, botPlatformType string, botActivity string, twitchChannelId string, commandAuthor, commandAuthorId string) error
	SaveBotCommandActivity(context context.Context, commandName string, twitchChannelId string, commandAuthor, commandAuthorId string)

	GetCommandAlias(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error)
	CreateCommandAliases(ctx context.Context, commandName string, aliases []string, twitchChannelId string, createdBy string) (*string, error)
	CheckCommandAliasExist(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error)
	DeleteCommandAlias(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error)
}

package db

import (
	"context"
	"time"

	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

type Database interface {
	GetTwitchChannels(ctx context.Context) ([]*models.TwitchChannel, error)
	CreateTwitchChannel(ctx context.Context, channelId string, channelName string, userId *string) (bool, error)

	GetTwitchBotConfig(ctx context.Context, twitchChannelId string, configKey string) (*models.TwitchBotConfig, error)
	CheckTwitchBotConfig(ctx context.Context, twitchChannelId string, configKey string, configValue string) bool

	GetGlobalBotCommand(ctx context.Context, commandName string) (*models.BotCommand, error)
	GetUserBotCommand(ctx context.Context, commandName string, twitchChannelId string) (*models.BotCommand, error)
	CreateBotCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string, createdBy string) (*string, error)
	CheckCommandExists(ctx context.Context, commandName string, twitchChannelId string) (*string, error)
	CheckGlobalCommandExists(ctx context.Context, commandName string) (*string, error)
	CheckUserCommandExists(ctx context.Context, commandName string, twitchChannelId string) (*string, error)
	UpdateBotCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string, updatedBy string) (*string, *string, error)
	DeleteBotCommand(ctx context.Context, commandName string, twitchChannelId string) (*string, *string, error)
	GetCommandList(ctx context.Context, twitchChannelId string) ([]*models.BotCommand, error)

	CreateTwitchBotActionActivity(ctx context.Context, botPlatformType string, botActivity string, twitchChannelId string, commandAuthor, commandAuthorId string) error
	SaveTwitchBotCommandActivity(context context.Context, commandName string, twitchChannelId string, commandAuthor, commandAuthorId string)

	GetCommandAlias(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error)
	CreateCommandAliases(ctx context.Context, commandName string, aliases []string, twitchChannelId string, createdBy string) (*string, error)
	CheckCommandAliasExist(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error)
	DeleteCommandAlias(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error)

	// DISCORD
	GetDiscordBotCommand(ctx context.Context, commandName string, discordServerId string) (*models.BotCommand, error)

	GetDiscordBotConfig(ctx context.Context, discordServerId string, configKey string) (*models.DiscordBotConfigs, error)
	CheckDiscordBotConfig(ctx context.Context, discordServerId string, configKey string, configValue string) bool

	CreateDiscordBotCommand(ctx context.Context, commandName string, commandContent string, discordServerId string, createdBy string) (*string, error)
	CheckDiscordBotCommandExists(ctx context.Context, commandName string, discordServerId string) (*string, error)
	UpdateDiscordBotCommand(ctx context.Context, commandName string, commandContent string, discordServerId string, updatedBy string) (*string, *string, error)
	DeleteDiscordBotCommand(ctx context.Context, commandName string, discordServerId string) (*string, *string, error)
	GetDiscordBotCommandList(ctx context.Context, discordServerId string) ([]*models.BotCommand, error)

	CreateDiscordBotActionActivity(ctx context.Context, botPlatformType string, botActivity string, discordServerId string, commandAuthor, commandAuthorId string) error
	SaveDiscordBotCommandActivity(context context.Context, commandName string, discordServerId string, commandAuthor, commandAuthorId string)

	GetDiscordBotCommandAlias(ctx context.Context, commandAlias string, discordServerId string) (*string, error)
	CreateDiscordBotCommandAlias(ctx context.Context, commandName string, aliases []string, discordServerId string, createdBy string) (*string, error)
	CheckDiscordBotCommandAliasExist(ctx context.Context, commandAlias string, discordServerId string) (*string, error)
	DeleteDiscordBotCommandAlias(ctx context.Context, commandAlias string, discordServerId string) (*string, error)
	SetDiscordBotConfig(ctx context.Context, serverId, key, value string) (bool, error)

	DeleteDiscordBotConfig(ctx context.Context, serverId, key string) (bool, error)
	AddAnnouncementChannel(ctx context.Context, channelId, serverId, createdBy string) (bool, error)
	GetAnnouncementChannels(ctx context.Context) ([]*models.DiscordAnnouncementChannels, error)
	GetAnnouncementChannelByChannelId(ctx context.Context, channelId string) (*models.DiscordAnnouncementChannels, error)
	GetAnnouncementChannelById(ctx context.Context, id int) (*models.DiscordAnnouncementChannels, error)
	DeleteAnnouncementChannel(ctx context.Context, channelId string) (bool, error)
	AddDiscordTwitchLiveAnnos(ctx context.Context, twitchUsername, twitchUserId, annoChannelId, annoServerId, createdBy string) (bool, error)
	UpdateTwitchStreamerAnnoContent(ctx context.Context, twitchUsername, annoServerId string, annoContent *string) (bool, error)
	UpdateTwitchStreamerLastAnnoDate(ctx context.Context, twitchUsername, annoServerId string, lastAnnoDate time.Time) (bool, error)
	GetTwitchStreamerLastAnnoDate(ctx context.Context, twitchUsername, annoServerId string) (*time.Time, error)
	GetTwitchStreamerAnnoContent(ctx context.Context, twitchUsername, annoServerId string) (*string, error)
	GetDiscordTwitchLiveAnno(ctx context.Context, twitchUserId, annoServerId string) (*models.DiscordTwitchLiveAnnos, error)
	GetDiscordTwitchLiveAnnoByUsername(ctx context.Context, twitchUsername, annoServerId string) (*models.DiscordTwitchLiveAnnos, error)
	GetDiscordTwitchLiveAnnos(ctx context.Context, serverId string) ([]*models.DiscordTwitchLiveAnnos, error)
	DeleteDiscordTwitchLiveAnno(ctx context.Context, twitchUserId string, serverId string) (bool, error)
	DeleteDiscordTwitchLiveAnnosByGuildId(ctx context.Context, serverId string) (bool, error)
	AddServerToDB(ctx context.Context, serverId string, serverName string, serverOwner string) error
	DeleteServerFromDB(ctx context.Context, serverId string) error

	// DISCORD

	AddBotCommandStatistic(ctx context.Context, commandName string) error
}

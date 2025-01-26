package db

import (
	"context"
	"time"

	"github.com/senchabot-opensource/monorepo/model"
	"github.com/senchabot-opensource/monorepo/platform"
)

type Database interface {
	GetTwitchChannels(ctx context.Context) ([]*model.TwitchChannel, error)
	CreateTwitchChannel(ctx context.Context, channelId string, channelName string, userId *string) (bool, error)
	DeleteTwitchChannel(ctx context.Context, channelId string, userId *string) (bool, error)

	GetTwitchBotConfig(ctx context.Context, twitchChannelId string, configKey string) (*model.TwitchBotConfig, error)
	CheckTwitchBotConfig(ctx context.Context, twitchChannelId string, configKey string, configValue string) bool

	GetGlobalBotCommand(ctx context.Context, commandName string) (*model.BotCommand, error)
	GetUserBotCommand(ctx context.Context, botPlatform platform.Platform, commandName string, botPlatformId string) (*model.BotCommand, error)
	CreateBotCommand(ctx context.Context, botPlatform platform.Platform, commandName string, commandContent string, botPlatformId string, createdBy string) (*string, error)
	CheckCommandExists(ctx context.Context, botPlatform platform.Platform, commandName string, botPlatformId string) (*string, error)
	CheckGlobalCommandExists(ctx context.Context, commandName string) (*string, error)
	CheckUserCommandExists(ctx context.Context, botPlatform platform.Platform, commandName string, botPlatformId string) (*string, error)
	UpdateBotCommand(ctx context.Context, botPlatform platform.Platform, commandName string, commandContent string, botPlatformId string, updatedBy string) (*string, *string, error)
	DeleteBotCommand(ctx context.Context, botPlatform platform.Platform, commandName string, botPlatformId string) (*string, *string, error)
	GetCommandList(ctx context.Context, botPlatform platform.Platform, botPlatformId string) ([]*model.BotCommand, error)

	// TIMER SYSTEM
	GetCommandTimers(ctx context.Context, botPlatform platform.Platform, botPlatformId string) ([]*model.CommandTimer, error)
	CreateCommandTimer(ctx context.Context, botPlatform platform.Platform, botPlatformId string, commandName string, interval int) (bool, error)
	UpdateCommandTimer(ctx context.Context, botPlatform platform.Platform, botPlatformId string, commandName string, interval int, status int) error
	GetCommandTimer(ctx context.Context, botPlatform platform.Platform, botPlatformId string, commandName string) *model.CommandTimer
	DeleteCommandTimer(ctx context.Context, botPlatform platform.Platform, botPlatformId string, commandName string) error
	// TIMER SYSTEM

	CreateBotActionActivity(ctx context.Context, botPlatform platform.Platform, botActivity string, botPlatformId string, commandAuthor, commandAuthorId string) error
	SaveTwitchBotCommandActivity(context context.Context, commandName string, twitchChannelId string, commandAuthor, commandAuthorId string)

	GetCommandAlias(ctx context.Context, botPlatform platform.Platform, commandAlias string, botPlatformId string) (*string, error)
	CreateCommandAlias(ctx context.Context, botPlatform platform.Platform, commandName string, aliases []string, botPlatformId string, createdBy string) (*string, error)
	CheckCommandAliasExist(ctx context.Context, botPlatform platform.Platform, commandAlias string, botPlatformId string) (*string, error)
	DeleteCommandAlias(ctx context.Context, botPlatform platform.Platform, commandAlias string, botPlatformId string) (*string, error)

	// DISCORD
	GetDiscordBotConfig(ctx context.Context, discordServerId string, configKey string) (*model.DiscordBotConfigs, error)
	CheckDiscordBotConfig(ctx context.Context, discordServerId string, configKey string, configValue string) bool

	SaveDiscordBotCommandActivity(context context.Context, commandName string, discordServerId string, commandAuthor, commandAuthorId string)

	SetDiscordBotConfig(ctx context.Context, serverId, key, value string) (bool, error)

	DeleteDiscordBotConfig(ctx context.Context, serverId, key string) (bool, error)
	AddAnnouncementChannel(ctx context.Context, channelId, serverId, createdBy string) (bool, error)
	GetAnnouncementChannels(ctx context.Context) ([]*model.DiscordAnnouncementChannels, error)
	GetAnnouncementChannelByChannelId(ctx context.Context, channelId string) (*model.DiscordAnnouncementChannels, error)
	GetAnnouncementChannelById(ctx context.Context, id int) (*model.DiscordAnnouncementChannels, error)
	DeleteAnnouncementChannel(ctx context.Context, channelId string) (bool, error)
	AddDiscordTwitchLiveAnnos(ctx context.Context, twitchUsername, twitchUserId, annoChannelId, annoServerId, createdBy string) (bool, error)
	UpdateTwitchStreamerAnnoContent(ctx context.Context, twitchUserId, annoServerId string, annoContent *string) (bool, error)
	UpdateTwitchStreamerLastAnnoDate(ctx context.Context, twitchUserId, annoServerId string, lastAnnoDate time.Time) (bool, error)
	GetTwitchStreamerLastAnnoDate(ctx context.Context, twitchUserId, annoServerId string) (*time.Time, error)
	GetTwitchStreamerAnnoContent(ctx context.Context, twitchUsername, annoServerId string) (*string, error)
	GetDiscordTwitchLiveAnno(ctx context.Context, twitchUserId, annoServerId string) (*model.DiscordTwitchLiveAnnos, error)
	GetDiscordTwitchLiveAnnoByUsername(ctx context.Context, twitchUsername, annoServerId string) (*model.DiscordTwitchLiveAnnos, error)
	GetDiscordTwitchLiveAnnos(ctx context.Context, serverId string) ([]*model.DiscordTwitchLiveAnnos, error)
	GetCountDiscordTwitchLiveAnnosWithoutContent(ctx context.Context, serverId string) (int64, error)
	GetCountDiscordTwitchLiveAnnosWithoutChannel(ctx context.Context, serverId string) (int64, error)
	DeleteDiscordTwitchLiveAnno(ctx context.Context, twitchUserId string, serverId string) (bool, error)
	DeleteDiscordTwitchLiveAnnosByGuildId(ctx context.Context, serverId string) (bool, error)
	DeleteDiscordTwitchLiveAnnosByChannelId(ctx context.Context, channelId string) (bool, error)
	GetDiscordChannelTwitchCategoryFilter(ctx context.Context, serverId string, channelId string) ([]*model.DiscordChannelTwitchCategoryFilter, error)
	SetDiscordChannelTwitchCategoryFilter(ctx context.Context, annoServerId, annoChannelId, categoryFilterRegex string, conditionType uint, createdBy string) (bool, error)
	DeleteDiscordChannelTwitchCategoryFilter(ctx context.Context, serverId string, channelId string) (bool, error)
	AddServerToDB(ctx context.Context, serverId string, serverName string, serverOwner string) error
	DeleteServerFromDB(ctx context.Context, serverId string) error
	GetServers(ctx context.Context) ([]*model.DiscordServer, error)

	// DISCORD

	AddBotCommandStatistic(ctx context.Context, botPlatform platform.Platform, commandName string) error

	// Command Variable methods
	GetCommandVariable(ctx context.Context, varName string, botPlatform platform.Platform, botPlatformId string) (*model.BotCommandVariable, error)
	CreateCommandVariable(ctx context.Context, varName string, varContent string, botPlatform platform.Platform, botPlatformId string, createdBy string) error
	UpdateCommandVariable(ctx context.Context, varName string, varContent string, botPlatform platform.Platform, botPlatformId string, updatedBy string) error
	DeleteCommandVariable(ctx context.Context, varName string, botPlatform platform.Platform, botPlatformId string, updatedBy string) error
	ListCommandVariables(ctx context.Context, botPlatform platform.Platform, botPlatformId string) ([]*model.BotCommandVariable, error)
	GetCustomVariableContent(ctx context.Context, botPlatform platform.Platform, botPlatformId string, varName string) string
}

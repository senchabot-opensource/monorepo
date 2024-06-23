package service

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service/webhook"
	"github.com/senchabot-opensource/monorepo/db"
	"github.com/senchabot-opensource/monorepo/db/postgresql"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/platform"
)

type Service interface {
	BotLeaveWebhook(client *discordgo.Session, w http.ResponseWriter, r *http.Request)

	GetUserBotCommand(ctx context.Context, commandName string, discordServerId string) (*models.BotCommand, error)
	GetGlobalBotCommand(ctx context.Context, commandName string) (*models.BotCommand, error)

	CreateCommand(ctx context.Context, commandName string, commandContent string, discordServerId string, createdBy string) (*string, error)
	CheckCommandExists(ctx context.Context, commandName string, discordServerId string) (*string, error)
	UpdateCommand(ctx context.Context, commandName string, commandContent string, discordServerId string, updatedBy string) (*string, *string, error)
	DeleteCommand(ctx context.Context, commandName string, discordServerId string) (*string, *string, error)
	GetCommandList(ctx context.Context, discordServerId string) ([]*models.BotCommand, error)

	SaveCommandActivity(context context.Context, commandName string, discordServerId string, commandAuthor, commandAuthorId string)

	GetCommandAlias(ctx context.Context, commandAlias string, discordServerId string) (*string, error)
	CreateCommandAlias(ctx context.Context, commandName string, aliases []string, discordServerId string, createdBy string) (*string, error)
	CheckCommandAliasExist(ctx context.Context, commandAlias string, discordServerId string) (*string, error)
	DeleteCommandAlias(ctx context.Context, commandAlias string, discordServerId string) (*string, error)

	AddAnnouncementChannel(ctx context.Context, channelId, serverId, createdBy string) (bool, error)
	GetAnnouncementChannels(ctx context.Context) ([]*models.DiscordAnnouncementChannels, error)
	GetAnnouncementChannelByChannelId(ctx context.Context, channelId string) (*models.DiscordAnnouncementChannels, error)
	GetAnnouncementChannelById(ctx context.Context, id int) (*models.DiscordAnnouncementChannels, error)
	DeleteAnnouncementChannel(ctx context.Context, channelId string) (bool, error)
	AddDiscordTwitchLiveAnnos(ctx context.Context, twitchUsername, twitchUserId, annoChannelId, annoServerId, createdBy string) (bool, error)
	UpdateTwitchStreamerAnnoContent(ctx context.Context, twitchUserId, annoServerId string, annoContent *string) (bool, error)
	UpdateTwitchStreamerLastAnnoDate(ctx context.Context, twitchUserId, annoServerId string, lastAnnoDate time.Time) (bool, error)
	GetTwitchStreamerLastAnnoDate(ctx context.Context, twitchUserId, annoServerId string) (*time.Time, error)
	GetTwitchStreamerAnnoContent(ctx context.Context, twitchUserId, annoServerId string) (*string, error)
	GetDiscordTwitchLiveAnno(ctx context.Context, twitchUserId, annoServerId string) (*models.DiscordTwitchLiveAnnos, error)
	GetDiscordTwitchLiveAnnoByUsername(ctx context.Context, twitchUsername, annoServerId string) (*models.DiscordTwitchLiveAnnos, error)
	GetDiscordTwitchLiveAnnos(ctx context.Context, serverId string) ([]*models.DiscordTwitchLiveAnnos, error)
	DeleteDiscordTwitchLiveAnno(ctx context.Context, twitchUserId string, serverId string) (bool, error)
	DeleteDiscordTwitchLiveAnnosByGuildId(ctx context.Context, serverId string) (bool, error)
	DeleteDiscordTwitchLiveAnnosByChannelId(ctx context.Context, channelId string) (bool, error)
	GetDiscordChannelTwitchCategoryFilter(ctx context.Context, serverId string, channelId string) ([]*models.DiscordChannelTwitchCategoryFilter, error)
	SetDiscordChannelTwitchCategoryFilter(ctx context.Context, annoServerId, annoChannelId, categoryFilterRegex, createdBy string) (bool, error)
	DeleteDiscordChannelTwitchCategoryFilter(ctx context.Context, serverId string, channelId string) (bool, error)
	AddServerToDB(ctx context.Context, serverId string, serverName string, serverOwner string) error
	DeleteServerFromDB(ctx context.Context, serverId string) error
	GetServers(ctx context.Context) ([]*models.DiscordServer, error)

	SetDiscordBotConfig(ctx context.Context, serverId, key, value string) (bool, error)
	DeleteDiscordBotConfig(ctx context.Context, serverId, key string) (bool, error)
	GetDiscordBotConfig(ctx context.Context, discordServerId string, configKey string) (*models.DiscordBotConfigs, error)
	CheckDiscordBotConfig(ctx context.Context, discordServerId string, configKey string, configValue string) bool

	AddBotCommandStatistic(ctx context.Context, commandName string)
}

type service struct {
	DB      db.Database
	Webhook webhook.Webhook
}

func New() Service {
	dbService := postgresql.New()
	whService := webhook.NewWebhook(dbService)

	return &service{
		DB:      dbService,
		Webhook: whService,
	}
}

func (s *service) BotLeaveWebhook(client *discordgo.Session, w http.ResponseWriter, r *http.Request) {
	s.Webhook.BotLeave(client, w, r)
}

func (s *service) GetUserBotCommand(ctx context.Context, commandName string, discordServerId string) (*models.BotCommand, error) {
	return s.DB.GetUserBotCommand(ctx, platform.DISCORD, commandName, discordServerId)
}

func (s *service) GetGlobalBotCommand(ctx context.Context, commandName string) (*models.BotCommand, error) {
	return s.DB.GetGlobalBotCommand(ctx, commandName)
}

func (s *service) CreateCommand(ctx context.Context, commandName string, commandContent string, discordServerId string, createdBy string) (*string, error) {
	infoText, err := s.DB.CreateBotCommand(ctx, platform.DISCORD, commandName, commandContent, discordServerId, createdBy)
	if err != nil {
		return nil, err
	}

	return infoText, nil
}

func (s *service) CheckCommandExists(ctx context.Context, commandName string, discordServerId string) (*string, error) {
	existCommandName, err := s.DB.CheckCommandExists(ctx, platform.DISCORD, commandName, discordServerId)
	if err != nil {
		return nil, err
	}

	return existCommandName, nil
}

func (s *service) UpdateCommand(ctx context.Context, commandName string, commandContent string, discordServerId string, updatedBy string) (*string, *string, error) {
	updatedCommandName, infoText, err := s.DB.UpdateBotCommand(ctx, platform.DISCORD, commandName, commandContent, discordServerId, updatedBy)
	if err != nil {
		return nil, nil, err
	}

	return updatedCommandName, infoText, nil
}

func (s *service) DeleteCommand(ctx context.Context, commandName string, discordServerId string) (*string, *string, error) {
	deletedCommandName, infoText, err := s.DB.DeleteBotCommand(ctx, platform.DISCORD, commandName, discordServerId)
	if err != nil {
		return nil, nil, err
	}

	return deletedCommandName, infoText, nil
}

func (s *service) GetCommandList(ctx context.Context, discordServerId string) ([]*models.BotCommand, error) {
	cmdList, err := s.DB.GetCommandList(ctx, platform.DISCORD, discordServerId)
	if err != nil {
		return nil, err
	}

	return cmdList, nil
}

func (s *service) SaveCommandActivity(context context.Context, commandName string, discordServerId string, commandAuthor, commandAuthorId string) {
	check := s.CheckDiscordBotConfig(context, discordServerId, "bot_activity_enabled", "1")
	if !check {
		return
	}

	commandName = "/" + commandName

	if err := s.DB.CreateBotActionActivity(context, platform.DISCORD, commandName, discordServerId, commandAuthor, commandAuthorId); err != nil {
		log.Println("[service.SaveCommandActivity] CreateBotActionActivity error:", err.Error())
	}
}

func (s *service) CreateCommandAlias(ctx context.Context, commandName string, aliases []string, discordServerId string, createdBy string) (*string, error) {
	return s.DB.CreateCommandAlias(ctx, platform.DISCORD, commandName, aliases, discordServerId, createdBy)
}
func (s *service) GetCommandAlias(ctx context.Context, commandAlias string, discordServerId string) (*string, error) {
	return s.DB.GetCommandAlias(ctx, platform.DISCORD, commandAlias, discordServerId)
}
func (s *service) CheckCommandAliasExist(ctx context.Context, commandAlias string, discordServerId string) (*string, error) {
	return s.DB.CheckCommandAliasExist(ctx, platform.DISCORD, commandAlias, discordServerId)
}
func (s *service) DeleteCommandAlias(ctx context.Context, commandAlias string, discordServerId string) (*string, error) {
	return s.DB.DeleteCommandAlias(ctx, platform.DISCORD, commandAlias, discordServerId)
}

// Discord

func (s *service) AddAnnouncementChannel(ctx context.Context, channelId string, serverId string, createdBy string) (bool, error) {
	return s.DB.AddAnnouncementChannel(ctx, channelId, serverId, createdBy)
}
func (s *service) GetAnnouncementChannels(ctx context.Context) ([]*models.DiscordAnnouncementChannels, error) {
	return s.DB.GetAnnouncementChannels(ctx)
}
func (s *service) GetAnnouncementChannelByChannelId(ctx context.Context, channelId string) (*models.DiscordAnnouncementChannels, error) {
	return s.DB.GetAnnouncementChannelByChannelId(ctx, channelId)
}
func (s *service) GetAnnouncementChannelById(ctx context.Context, id int) (*models.DiscordAnnouncementChannels, error) {
	return s.DB.GetAnnouncementChannelById(ctx, id)
}
func (s *service) DeleteAnnouncementChannel(ctx context.Context, channelId string) (bool, error) {
	return s.DB.DeleteAnnouncementChannel(ctx, channelId)
}
func (s *service) AddDiscordTwitchLiveAnnos(ctx context.Context, twitchUsername, twitchUserId, annoChannelId, annoServerId, createdBy string) (bool, error) {
	return s.DB.AddDiscordTwitchLiveAnnos(ctx, twitchUsername, twitchUserId, annoChannelId, annoServerId, createdBy)
}
func (s *service) UpdateTwitchStreamerAnnoContent(ctx context.Context, twitchUserId, annoServerId string, annoContent *string) (bool, error) {
	return s.DB.UpdateTwitchStreamerAnnoContent(ctx, twitchUserId, annoServerId, annoContent)
}
func (s *service) UpdateTwitchStreamerLastAnnoDate(ctx context.Context, twitchUserId, annoServerId string, lastAnnoDate time.Time) (bool, error) {
	return s.DB.UpdateTwitchStreamerLastAnnoDate(ctx, twitchUserId, annoServerId, lastAnnoDate)
}
func (s *service) GetTwitchStreamerLastAnnoDate(ctx context.Context, twitchUserId, annoServerId string) (*time.Time, error) {
	return s.DB.GetTwitchStreamerLastAnnoDate(ctx, twitchUserId, annoServerId)
}
func (s *service) GetTwitchStreamerAnnoContent(ctx context.Context, twitchUserId, annoServerId string) (*string, error) {
	return s.DB.GetTwitchStreamerAnnoContent(ctx, twitchUserId, annoServerId)
}
func (s *service) GetDiscordTwitchLiveAnno(ctx context.Context, twitchUserId, annoServerId string) (*models.DiscordTwitchLiveAnnos, error) {
	return s.DB.GetDiscordTwitchLiveAnno(ctx, twitchUserId, annoServerId)
}
func (s *service) GetDiscordTwitchLiveAnnoByUsername(ctx context.Context, twitchUsername, annoServerId string) (*models.DiscordTwitchLiveAnnos, error) {
	return s.DB.GetDiscordTwitchLiveAnnoByUsername(ctx, twitchUsername, annoServerId)
}
func (s *service) GetDiscordTwitchLiveAnnos(ctx context.Context, serverId string) ([]*models.DiscordTwitchLiveAnnos, error) {
	return s.DB.GetDiscordTwitchLiveAnnos(ctx, serverId)
}
func (s *service) DeleteDiscordTwitchLiveAnno(ctx context.Context, twitchUserId string, serverId string) (bool, error) {
	return s.DB.DeleteDiscordTwitchLiveAnno(ctx, twitchUserId, serverId)
}
func (s *service) DeleteDiscordTwitchLiveAnnosByGuildId(ctx context.Context, serverId string) (bool, error) {
	return s.DB.DeleteDiscordTwitchLiveAnnosByGuildId(ctx, serverId)
}
func (s *service) DeleteDiscordTwitchLiveAnnosByChannelId(ctx context.Context, channelId string) (bool, error) {
	return s.DB.DeleteDiscordTwitchLiveAnnosByChannelId(ctx, channelId)
}
func (s *service) GetDiscordChannelTwitchCategoryFilter(ctx context.Context, serverId string, channelId string) ([]*models.DiscordChannelTwitchCategoryFilter, error) {
	return s.DB.GetDiscordChannelTwitchCategoryFilter(ctx, serverId, channelId)
}
func (s *service) SetDiscordChannelTwitchCategoryFilter(ctx context.Context, annoServerId, annoChannelId, categoryFilterRegex, createdBy string) (bool, error) {
	return s.DB.SetDiscordChannelTwitchCategoryFilter(ctx, annoServerId, annoChannelId, categoryFilterRegex, createdBy)
}
func (s *service) DeleteDiscordChannelTwitchCategoryFilter(ctx context.Context, serverId string, channelId string) (bool, error) {
	return s.DB.DeleteDiscordChannelTwitchCategoryFilter(ctx, serverId, channelId)
}
func (s *service) AddServerToDB(ctx context.Context, serverId string, serverName string, serverOwner string) error {
	return s.DB.AddServerToDB(ctx, serverId, serverName, serverOwner)
}
func (s *service) DeleteServerFromDB(ctx context.Context, serverId string) error {
	return s.DB.DeleteServerFromDB(ctx, serverId)
}
func (s *service) GetServers(ctx context.Context) ([]*models.DiscordServer, error) {
	return s.DB.GetServers(ctx)
}

// DISCORD BOT CONFIG
func (s *service) SetDiscordBotConfig(ctx context.Context, serverId, key, value string) (bool, error) {
	return s.DB.SetDiscordBotConfig(ctx, serverId, key, value)
}
func (s *service) DeleteDiscordBotConfig(ctx context.Context, serverId string, key string) (bool, error) {
	return s.DB.DeleteDiscordBotConfig(ctx, serverId, key)
}
func (s *service) GetDiscordBotConfig(ctx context.Context, discordServerId string, configKey string) (*models.DiscordBotConfigs, error) {
	return s.DB.GetDiscordBotConfig(ctx, discordServerId, configKey)
}
func (s *service) CheckDiscordBotConfig(ctx context.Context, discordServerId string, configKey string, configValue string) bool {
	configData, err := s.DB.GetDiscordBotConfig(ctx, discordServerId, configKey)
	if err != nil {
		log.Println("[service.CheckDiscordBotConfig] GetDiscordBotConfig error:", err.Error())
		return false
	}

	if configData != nil && configData.Value == configValue {
		return true
	}

	return false
}

// DISCORD BOT CONFIG

func (s *service) AddBotCommandStatistic(ctx context.Context, commandName string) {
	if err := s.DB.AddBotCommandStatistic(ctx, platform.DISCORD, commandName); err != nil {
		log.Println("[service.AddBotCommandStatistic] AddBotCommandStatistic error:", err.Error())
	}
}

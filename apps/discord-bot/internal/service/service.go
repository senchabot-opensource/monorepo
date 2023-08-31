package service

import (
	"context"
	"fmt"
	"time"

	"github.com/senchabot-opensource/monorepo/db"
	"github.com/senchabot-opensource/monorepo/db/mysql"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

type Service interface {
	GetDiscordBotCommand(ctx context.Context, commandName string, discordServerId string) (*models.BotCommand, error)

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

	SetDiscordBotConfig(ctx context.Context, serverId, key, value string) (bool, error)
	DeleteDiscordBotConfig(ctx context.Context, serverId, key string) (bool, error)
	GetDiscordBotConfig(ctx context.Context, discordServerId string, configKey string) (*models.DiscordBotConfigs, error)
	CheckDiscordBotConfig(ctx context.Context, discordServerId string, configKey string, configValue string) bool
}

type service struct {
	DB db.Database
}

func New() Service {
	dbService := mysql.NewMySQL()

	return &service{
		DB: dbService,
	}
}

func (s *service) GetDiscordBotCommand(ctx context.Context, commandName string, discordServerId string) (*models.BotCommand, error) {
	return s.DB.GetDiscordBotCommand(ctx, commandName, discordServerId)
}

func (s *service) CreateDiscordBotCommand(ctx context.Context, commandName string, commandContent string, discordServerId string, createdBy string) (*string, error) {
	infoText, err := s.DB.CreateDiscordBotCommand(ctx, commandName, commandContent, discordServerId, createdBy)
	if err != nil {
		return nil, err
	}

	return infoText, nil
}

func (s *service) CheckDiscordBotCommandExists(ctx context.Context, commandName string, discordServerId string) (*string, error) {
	existCommandName, err := s.DB.CheckDiscordBotCommandExists(ctx, commandName, discordServerId)
	if err != nil {
		return nil, err
	}

	return existCommandName, nil
}

func (s *service) UpdateDiscordBotCommand(ctx context.Context, commandName string, commandContent string, discordServerId string, updatedBy string) (*string, *string, error) {
	updatedCommandName, infoText, err := s.DB.UpdateDiscordBotCommand(ctx, commandName, commandContent, discordServerId, updatedBy)
	if err != nil {
		return nil, nil, err
	}

	return updatedCommandName, infoText, nil
}

func (s *service) DeleteDiscordBotCommand(ctx context.Context, commandName string, discordServerId string) (*string, *string, error) {
	deletedCommandName, infoText, err := s.DB.DeleteDiscordBotCommand(ctx, commandName, discordServerId)
	if err != nil {
		return nil, nil, err
	}

	return deletedCommandName, infoText, nil
}

func (s *service) GetDiscordBotCommandList(ctx context.Context, discordServerId string) ([]*models.BotCommand, error) {
	cmdList, err := s.DB.GetDiscordBotCommandList(ctx, discordServerId)
	if err != nil {
		return nil, err
	}

	return cmdList, nil
}

func (s *service) CreateDiscordBotActionActivity(ctx context.Context, botPlatformType string, botActivity string, discordServerId string, activityAuthor, commandAuthorId string) error {
	err := s.DB.CreateDiscordBotActionActivity(ctx, botPlatformType, botActivity, discordServerId, activityAuthor, commandAuthorId)

	if err != nil {
		return err
	}

	return nil
}

func (s *service) SaveDiscordBotCommandActivity(context context.Context, commandName string, discordServerId string, commandAuthor, commandAuthorId string) {
	check := s.CheckDiscordBotConfig(context, discordServerId, "bot_activity_enabled", "1")
	if !check {
		return
	}

	commandName = "!" + commandName

	if err := s.CreateDiscordBotActionActivity(context, "twitch", commandName, discordServerId, commandAuthor, commandAuthorId); err != nil {
		fmt.Println(err.Error())
	}
}

func (s *service) CreateDiscordBotCommandAlias(ctx context.Context, commandName string, aliases []string, discordServerId string, createdBy string) (*string, error) {
	return s.DB.CreateDiscordBotCommandAlias(ctx, commandName, aliases, discordServerId, createdBy)
}
func (s *service) GetDiscordBotCommandAlias(ctx context.Context, commandAlias string, discordServerId string) (*string, error) {
	return s.DB.GetDiscordBotCommandAlias(ctx, commandAlias, discordServerId)
}
func (s *service) CheckDiscordBotCommandAliasExist(ctx context.Context, commandAlias string, discordServerId string) (*string, error) {
	return s.DB.CheckDiscordBotCommandAliasExist(ctx, commandAlias, discordServerId)
}
func (s *service) DeleteDiscordBotCommandAlias(ctx context.Context, commandAlias string, discordServerId string) (*string, error) {
	return s.DB.DeleteDiscordBotCommandAlias(ctx, commandAlias, discordServerId)
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
func (s *service) UpdateTwitchStreamerAnnoContent(ctx context.Context, twitchUsername, annoServerId string, annoContent *string) (bool, error) {
	return s.DB.UpdateTwitchStreamerAnnoContent(ctx, twitchUsername, annoServerId, annoContent)
}
func (s *service) UpdateTwitchStreamerLastAnnoDate(ctx context.Context, twitchUsername, annoServerId string, lastAnnoDate time.Time) (bool, error) {
	return s.DB.UpdateTwitchStreamerLastAnnoDate(ctx, twitchUsername, annoServerId, lastAnnoDate)
}
func (s *service) GetTwitchStreamerLastAnnoDate(ctx context.Context, twitchUsername, annoServerId string) (*time.Time, error) {
	return s.DB.GetTwitchStreamerLastAnnoDate(ctx, twitchUsername, annoServerId)
}
func (s *service) GetTwitchStreamerAnnoContent(ctx context.Context, twitchUsername, annoServerId string) (*string, error) {
	return s.DB.GetTwitchStreamerAnnoContent(ctx, twitchUsername, annoServerId)
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
func (s *service) AddServerToDB(ctx context.Context, serverId string, serverName string, serverOwner string) error {
	return s.DB.AddServerToDB(ctx, serverId, serverName, serverOwner)
}
func (s *service) DeleteServerFromDB(ctx context.Context, serverId string) error {
	return s.DB.DeleteServerFromDB(ctx, serverId)
}

// DISCORD BOT CONFIG
func (s *service) SetDiscordBotConfig(ctx context.Context, serverId, key, value string) (bool, error) {
	return s.DB.SetDiscordBotConfig(ctx, serverId, key, value)
}
func (s *service) DeleteDiscordBotConfig(ctx context.Context, serverId string, key string) (bool, error) {
	fmt.Println("test")
	return s.DB.DeleteDiscordBotConfig(ctx, serverId, key)
}
func (s *service) GetDiscordBotConfig(ctx context.Context, discordServerId string, configKey string) (*models.DiscordBotConfigs, error) {
	return s.DB.GetDiscordBotConfig(ctx, discordServerId, configKey)
}
func (s *service) CheckDiscordBotConfig(ctx context.Context, discordServerId string, configKey string, configValue string) bool {
	configData, err := s.DB.GetDiscordBotConfig(ctx, discordServerId, configKey)
	if err != nil {
		fmt.Println(err.Error())
		return false
	}

	if configData != nil && configData.Value == configValue {
		return true
	}

	return false
}

// DISCORD BOT CONFIG

package service

import (
	"context"
	"fmt"
	"net/http"

	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/service/timer"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/service/webhook"
	"github.com/senchabot-opensource/monorepo/db"
	"github.com/senchabot-opensource/monorepo/db/mysql"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/platform"
)

type Service interface {
	BotJoinWebhook(client *client.Clients, joinedChannelList []string, w http.ResponseWriter, r *http.Request)

	GetTwitchChannels(ctx context.Context) ([]*models.TwitchChannel, error)
	CreateTwitchChannel(ctx context.Context, channelId string, channelName string, userId *string) (bool, error)

	GetTwitchBotConfig(ctx context.Context, twitchChannelId string, configKey string) (*models.TwitchBotConfig, error)
	CheckTwitchBotConfig(ctx context.Context, twitchChannelId string, configKey string, configValue string) bool

	GetGlobalBotCommand(ctx context.Context, commandName string) (*models.BotCommand, error)
	GetUserBotCommand(ctx context.Context, commandName string, twitchChannelId string) (*models.BotCommand, error)
	CreateCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string, createdBy string) (*string, error)
	CheckCommandExists(ctx context.Context, commandName string, twitchChannelId string) (*string, error)
	UpdateCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string, updatedBy string) (*string, *string, error)
	DeleteCommand(ctx context.Context, commandName string, twitchChannelId string) (*string, *string, error)
	GetCommandList(ctx context.Context, twitchChannelId string) ([]*models.BotCommand, error)

	SaveCommandActivity(context context.Context, commandName string, twitchChannelId string, commandAuthor, commandAuthorId string)

	GetCommandAlias(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error)
	CreateCommandAlias(ctx context.Context, commandName string, aliases []string, twitchChannelId string, createdBy string) (*string, error)
	CheckCommandAliasExist(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error)
	DeleteCommandAlias(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error)

	SetTimer(client *client.Clients, channelName string, commandData *models.BotCommand, interval int)
	SetTimerEnabled(client *client.Clients, commandId int)
	SetTimerDisabled(commandId int)
	GetTimerStatus(commandId int) bool

	CreateCommandTimer(ctx context.Context, botPlatformType string, channelId string, commandName string, interval int) error
	CheckCommandTimerExist(ctx context.Context, botPlatformType string, channelId string, commandName string) bool
	UpdateCommandTimer(ctx context.Context, botPlatformType string, channelId string, commandName string, interval int, status int) error
	DeleteCommandTimer(ctx context.Context, botPlatformType string, channelId string, commandName string) error
}

type services struct {
	DB      db.Database
	Webhook webhook.Webhook
	Timer   timer.Timer
}

func NewServices() Service {
	dbService := mysql.NewMySQL()
	whService := webhook.NewWebhooks()
	timerService := timer.NewTimer()

	return &services{
		DB:      dbService,
		Webhook: whService,
		Timer:   timerService,
	}
}

func (s *services) SetTimer(client *client.Clients, channelName string, commandData *models.BotCommand, interval int) {
	// platform, channelId, commandData, interval, status
	s.Timer.SetTimer(client, channelName, commandData, interval)
}

func (s *services) SetTimerEnabled(client *client.Clients, commandId int) {
	s.Timer.SetTimerEnabled(client, commandId)
}

func (s *services) SetTimerDisabled(commandId int) {
	s.Timer.SetTimerDisabled(commandId)
}

func (s *services) GetTimerStatus(commandId int) bool {
	return s.Timer.GetTimerStatus(commandId)
}

func (s *services) BotJoinWebhook(client *client.Clients, joinedChannelList []string, w http.ResponseWriter, r *http.Request) {
	s.Webhook.BotJoin(client, joinedChannelList, w, r)
}

func (s *services) GetTwitchChannels(ctx context.Context) ([]*models.TwitchChannel, error) {
	twitchChannels, err := s.DB.GetTwitchChannels(ctx)
	if err != nil {
		return nil, err
	}

	return twitchChannels, nil
}

func (s *services) CreateTwitchChannel(ctx context.Context, channelId string, channelName string, userId *string) (bool, error) {
	alreadyJoined, err := s.DB.CreateTwitchChannel(ctx, channelId, channelName, userId)
	if err != nil {
		return false, err
	}

	return alreadyJoined, nil
}

func (s *services) GetTwitchBotConfig(ctx context.Context, twitchChannelId string, configKey string) (*models.TwitchBotConfig, error) {
	configData, err := s.DB.GetTwitchBotConfig(ctx, twitchChannelId, configKey)
	if err != nil {
		return nil, err
	}

	return configData, nil
}

func (s *services) CheckTwitchBotConfig(ctx context.Context, twitchChannelId string, configKey string, configValue string) bool {
	configData, err := s.DB.GetTwitchBotConfig(ctx, twitchChannelId, configKey)
	if err != nil {
		fmt.Println(err.Error())
		return false
	}

	if configData != nil && configData.Value == configValue {
		return true
	}

	return false
}

func (s *services) GetGlobalBotCommand(ctx context.Context, commandName string) (*models.BotCommand, error) {
	commandData, err := s.DB.GetGlobalBotCommand(ctx, commandName)
	if err != nil {
		return nil, err
	}

	return commandData, nil
}

func (s *services) GetUserBotCommand(ctx context.Context, commandName string, twitchChannelId string) (*models.BotCommand, error) {
	commandData, err := s.DB.GetUserBotCommand(ctx, platform.TWITCH, commandName, twitchChannelId)
	if err != nil {
		return nil, err
	}

	return commandData, nil
}

func (s *services) CreateCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string, createdBy string) (*string, error) {
	infoText, err := s.DB.CreateBotCommand(ctx, platform.TWITCH, commandName, commandContent, twitchChannelId, createdBy)
	if err != nil {
		return nil, err
	}

	return infoText, nil
}

func (s *services) CheckCommandExists(ctx context.Context, commandName string, twitchChannelId string) (*string, error) {
	existCommandName, err := s.DB.CheckCommandExists(ctx, platform.TWITCH, commandName, twitchChannelId)
	if err != nil {
		return nil, err
	}

	return existCommandName, nil
}

func (s *services) UpdateCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string, updatedBy string) (*string, *string, error) {
	updatedCommandName, infoText, err := s.DB.UpdateBotCommand(ctx, platform.TWITCH, commandName, commandContent, twitchChannelId, updatedBy)
	if err != nil {
		return nil, nil, err
	}

	return updatedCommandName, infoText, nil
}

func (s *services) DeleteCommand(ctx context.Context, commandName string, twitchChannelId string) (*string, *string, error) {
	deletedCommandName, infoText, err := s.DB.DeleteBotCommand(ctx, platform.TWITCH, commandName, twitchChannelId)
	if err != nil {
		return nil, nil, err
	}

	return deletedCommandName, infoText, nil
}

func (s *services) GetCommandList(ctx context.Context, twitchChannelId string) ([]*models.BotCommand, error) {
	cmdList, err := s.DB.GetCommandList(ctx, platform.TWITCH, twitchChannelId)
	if err != nil {
		return nil, err
	}

	return cmdList, nil
}

func (s *services) SaveCommandActivity(context context.Context, commandName string, twitchChannelId string, commandAuthor, commandAuthorId string) {
	check := s.CheckTwitchBotConfig(context, twitchChannelId, "bot_activity_enabled", "1")
	if !check {
		return
	}

	commandName = "!" + commandName

	if err := s.DB.CreateBotActionActivity(context, platform.TWITCH, commandName, twitchChannelId, commandAuthor, commandAuthorId); err != nil {
		fmt.Println(err.Error())
	}
}

func (s *services) CreateCommandAlias(ctx context.Context, commandName string, aliases []string, twitchChannelId string, createdBy string) (*string, error) {
	infoText, err := s.DB.CreateCommandAlias(ctx, platform.TWITCH, commandName, aliases, twitchChannelId, createdBy)
	if err != nil {
		return nil, err
	}

	return infoText, nil
}

func (s *services) GetCommandAlias(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error) {
	command, err := s.DB.GetCommandAlias(ctx, platform.TWITCH, commandAlias, twitchChannelId)
	if err != nil {
		return nil, err
	}

	return command, nil
}

func (s *services) CheckCommandAliasExist(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error) {
	alias, err := s.DB.CheckCommandAliasExist(ctx, platform.TWITCH, commandAlias, twitchChannelId)

	if err != nil {
		return nil, err
	}

	return alias, nil
}

func (s *services) DeleteCommandAlias(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error) {
	infoText, err := s.DB.DeleteCommandAlias(ctx, platform.TWITCH, commandAlias, twitchChannelId)
	if err != nil {
		return nil, err
	}

	return infoText, nil
}

func (s *services) CreateCommandTimer(ctx context.Context, botPlatformType string, channelId string, commandName string, interval int) error {
	return s.DB.CreateCommandTimer(ctx, botPlatformType, channelId, commandName, interval)
}
func (s *services) CheckCommandTimerExist(ctx context.Context, botPlatformType string, channelId string, commandName string) bool {
	return s.DB.CheckCommandTimerExist(ctx, botPlatformType, channelId, commandName)
}
func (s *services) UpdateCommandTimer(ctx context.Context, botPlatformType string, channelId string, commandName string, interval int, status int) error {
	return s.DB.UpdateCommandTimer(ctx, botPlatformType, channelId, commandName, interval, status)
}
func (s *services) DeleteCommandTimer(ctx context.Context, botPlatformType string, channelId string, commandName string) error {
	return s.DB.DeleteCommandTimer(ctx, botPlatformType, channelId, commandName)
}

package service

import (
	"context"
	"log"
	"net/http"

	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/service/timer"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/service/webhook"
	"github.com/senchabot-opensource/monorepo/db"
	botcommandgrpc "github.com/senchabot-opensource/monorepo/grpc/botcommand/client"
	"github.com/senchabot-opensource/monorepo/model"

	"github.com/senchabot-opensource/monorepo/platform"
	"github.com/senchabot-opensource/monorepo/twitchapi"
)

type Service interface {
	BotJoinWebhook(client *client.Clients, joinedChannelList []string, w http.ResponseWriter, r *http.Request)
	BotDepartWebhook(client *client.Clients, joinedChannelList []string, w http.ResponseWriter, r *http.Request)

	GetTwitchChannels(ctx context.Context) ([]*model.TwitchChannel, error)
	CreateTwitchChannel(ctx context.Context, channelId string, channelName string, userId *string) (bool, error)
	DeleteTwitchChannel(ctx context.Context, channelId string, userId *string) (bool, error)

	GetTwitchBotConfig(ctx context.Context, twitchChannelId string, configKey string) (*model.TwitchBotConfig, error)
	CheckTwitchBotConfig(ctx context.Context, twitchChannelId string, configKey string, configValue string) bool

	GetGlobalBotCommand(ctx context.Context, commandName string) (*model.BotCommand, error)
	GetUserBotCommand(ctx context.Context, commandName string, twitchChannelId string) (*model.BotCommand, error)
	CreateCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string, createdBy string) (*string, error)
	CheckCommandExists(ctx context.Context, commandName string, twitchChannelId string) (*string, error)
	UpdateCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string, updatedBy string) (*string, *string, error)
	DeleteCommand(ctx context.Context, commandName string, twitchChannelId string) (*string, *string, error)
	GetCommandList(ctx context.Context, twitchChannelId string) ([]*model.BotCommand, error)

	SaveCommandActivity(context context.Context, commandName string, twitchChannelId string, commandAuthor, commandAuthorId string)

	GetCommandAlias(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error)
	CreateCommandAlias(ctx context.Context, commandName string, aliases []string, twitchChannelId string, createdBy string) (*string, error)
	CheckCommandAliasExist(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error)
	DeleteCommandAlias(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error)

	SetTimer(client *client.Clients, channelName string, commandData *model.BotCommand, interval int)
	SetTimerEnabled(client *client.Clients, commandId int)
	SetTimerDisabled(commandId int)
	GetTimerStatus(commandId int) bool
	DeleteTimer(commandId int)
	UpdateTimerContent(commandId int, commandContent string)

	GetCommandTimers(ctx context.Context, botPlatformId string) ([]*model.CommandTimer, error)
	CreateCommandTimer(ctx context.Context, channelId string, commandName string, interval int) (bool, error)
	GetCommandTimer(ctx context.Context, channelId string, commandName string) *model.CommandTimer
	UpdateCommandTimer(ctx context.Context, channelId string, commandName string, interval int, status int) error
	UpdateCommandTimerInterval(commandId, interval int)
	DeleteCommandTimer(ctx context.Context, channelId string, commandName string) error

	// Command Variable methods
	GetCommandVariable(ctx context.Context, varName string, botPlatformId string) (*model.BotCommandVariable, error)
	CreateCommandVariable(ctx context.Context, varName string, varContent string, botPlatformId string, createdBy string) error
	UpdateCommandVariable(ctx context.Context, varName string, varContent string, botPlatformId string, updatedBy string) error
	DeleteCommandVariable(ctx context.Context, varName string, botPlatformId string, updatedBy string) error
	ListCommandVariables(ctx context.Context, botPlatformId string) ([]*model.BotCommandVariable, error)
	GetCustomVariableContent(ctx context.Context, botPlatformId string, varName string) string
}

type service struct {
	timer            timer.Timer
	db               db.Database
	botCommandClient *botcommandgrpc.BotCommandClient
	webhook          webhook.Webhook
	twitchService    twitchapi.TwitchService
}

func New(botCommandClient *botcommandgrpc.BotCommandClient, twitchService twitchapi.TwitchService, database db.Database) Service {
	return &service{
		db:               database,
		botCommandClient: botCommandClient,
		twitchService:    twitchService,
		webhook:          webhook.NewWebhook(database, twitchService),
		timer:            timer.NewTimer(),
	}
}

func (s *service) BotJoinWebhook(client *client.Clients, joinedChannelList []string, w http.ResponseWriter, r *http.Request) {
	s.webhook.BotJoin(client, joinedChannelList, w, r)
}

func (s *service) BotDepartWebhook(client *client.Clients, joinedChannelList []string, w http.ResponseWriter, r *http.Request) {
	s.webhook.BotDepart(client, joinedChannelList, w, r)
}

func (s *service) GetTwitchChannels(ctx context.Context) ([]*model.TwitchChannel, error) {
	twitchChannels, err := s.db.GetTwitchChannels(ctx)
	if err != nil {
		return nil, err
	}

	return twitchChannels, nil
}

func (s *service) CreateTwitchChannel(ctx context.Context, channelId string, channelName string, userId *string) (bool, error) {
	alreadyJoined, err := s.db.CreateTwitchChannel(ctx, channelId, channelName, userId)
	if err != nil {
		return false, err
	}

	return alreadyJoined, nil
}

func (s *service) DeleteTwitchChannel(ctx context.Context, channelId string, userId *string) (bool, error) {
	deleted, err := s.db.DeleteTwitchChannel(ctx, channelId, userId)
	if err != nil {
		return false, err
	}

	return deleted, nil
}

func (s *service) GetTwitchBotConfig(ctx context.Context, twitchChannelId string, configKey string) (*model.TwitchBotConfig, error) {
	configData, err := s.db.GetTwitchBotConfig(ctx, twitchChannelId, configKey)
	if err != nil {
		return nil, err
	}

	return configData, nil
}

func (s *service) CheckTwitchBotConfig(ctx context.Context, twitchChannelId string, configKey string, configValue string) bool {
	configData, err := s.db.GetTwitchBotConfig(ctx, twitchChannelId, configKey)
	if err != nil {
		log.Println("[service.CheckTwitchBotConfig] GetTwitchBotConfig Error:", err.Error())
		return false
	}

	if configData != nil && configData.Value == configValue {
		return true
	}

	return false
}

func (s *service) GetGlobalBotCommand(ctx context.Context, commandName string) (*model.BotCommand, error) {
	cmd, err := s.botCommandClient.GetGlobalBotCommand(ctx, commandName)
	if err != nil {
		return nil, err
	}
	if cmd == nil {
		return nil, nil
	}
	return &model.BotCommand{
		ID:             int(cmd.Id),
		CommandName:    cmd.CommandName,
		CommandContent: cmd.CommandContent,
		CommandType:    int(cmd.CommandType),
		Status:         int(cmd.Status),
	}, nil
}

func (s *service) GetUserBotCommand(ctx context.Context, commandName string, twitchChannelId string) (*model.BotCommand, error) {
	cmd, err := s.botCommandClient.GetUserBotCommand(ctx, platform.TWITCH.String(), commandName, twitchChannelId)
	if err != nil {
		return nil, err
	}
	if cmd == nil {
		return nil, nil
	}
	return &model.BotCommand{
		ID:             int(cmd.Id),
		CommandName:    cmd.CommandName,
		CommandContent: cmd.CommandContent,
		CommandType:    int(cmd.CommandType),
		Status:         int(cmd.Status),
	}, nil
}

func (s *service) CreateCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string, createdBy string) (*string, error) {
	resp, err := s.botCommandClient.CreateBotCommand(ctx, platform.TWITCH.String(), commandName, commandContent, twitchChannelId, createdBy)
	if err != nil {
		return nil, err
	}
	return &resp.InfoText, nil
}

func (s *service) CheckCommandExists(ctx context.Context, commandName string, twitchChannelId string) (*string, error) {
	cmd, err := s.botCommandClient.GetUserBotCommand(ctx, platform.TWITCH.String(), commandName, twitchChannelId)
	if err != nil {
		return nil, err
	}
	if cmd == nil {
		return nil, nil
	}
	return &cmd.CommandName, nil
}

func (s *service) UpdateCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string, updatedBy string) (*string, *string, error) {
	resp, err := s.botCommandClient.UpdateBotCommand(ctx, platform.TWITCH.String(), commandName, commandContent, twitchChannelId, updatedBy)
	if err != nil {
		return nil, nil, err
	}
	return &resp.CommandName, &resp.InfoText, nil
}

func (s *service) DeleteCommand(ctx context.Context, commandName string, twitchChannelId string) (*string, *string, error) {
	resp, err := s.botCommandClient.DeleteBotCommand(ctx, platform.TWITCH.String(), commandName, twitchChannelId)
	if err != nil {
		return nil, nil, err
	}
	return &resp.CommandName, &resp.InfoText, nil
}

func (s *service) GetCommandList(ctx context.Context, twitchChannelId string) ([]*model.BotCommand, error) {
	cmds, err := s.botCommandClient.GetCommandList(ctx, platform.TWITCH.String(), twitchChannelId)
	if err != nil {
		return nil, err
	}
	var result []*model.BotCommand
	for _, cmd := range cmds {
		result = append(result, &model.BotCommand{
			ID:             int(cmd.Id),
			CommandName:    cmd.CommandName,
			CommandContent: cmd.CommandContent,
			CommandType:    int(cmd.CommandType),
			Status:         int(cmd.Status),
		})
	}
	return result, nil
}

func (s *service) SaveCommandActivity(context context.Context, commandName string, twitchChannelId string, commandAuthor, commandAuthorId string) {
	check := s.CheckTwitchBotConfig(context, twitchChannelId, "bot_activity_enabled", "1")
	if !check {
		return
	}

	commandName = "!" + commandName

	if err := s.db.CreateBotActionActivity(context, platform.TWITCH, commandName, twitchChannelId, commandAuthor, commandAuthorId); err != nil {
		log.Println("[service.SaveCommandActivity] CreateBotActionActivity Error:", err.Error())
	}
}

func (s *service) CreateCommandAlias(ctx context.Context, commandName string, aliases []string, twitchChannelId string, createdBy string) (*string, error) {
	resp, err := s.botCommandClient.CreateCommandAlias(ctx, platform.TWITCH.String(), commandName, aliases, twitchChannelId, createdBy)
	if err != nil {
		return nil, err
	}
	return &resp.InfoText, nil
}

func (s *service) GetCommandAlias(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error) {
	commandName, err := s.botCommandClient.GetCommandAlias(ctx, platform.TWITCH.String(), commandAlias, twitchChannelId)
	if err != nil {
		return nil, err
	}
	return &commandName, nil
}

func (s *service) CheckCommandAliasExist(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error) {
	commandName, err := s.botCommandClient.GetCommandAlias(ctx, platform.TWITCH.String(), commandAlias, twitchChannelId)
	if err != nil {
		return nil, err
	}
	if commandName == "" {
		return nil, nil
	}
	return &commandName, nil
}

func (s *service) DeleteCommandAlias(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error) {
	resp, err := s.botCommandClient.DeleteCommandAlias(ctx, platform.TWITCH.String(), commandAlias, twitchChannelId)
	if err != nil {
		return nil, err
	}
	return &resp.InfoText, nil
}

func (s *service) SetTimer(client *client.Clients, channelName string, commandData *model.BotCommand, interval int) {
	// platform, channelId, commandData, interval, status
	s.timer.SetTimer(client, channelName, commandData, interval)
}

func (s *service) SetTimerEnabled(client *client.Clients, commandId int) {
	s.timer.SetTimerEnabled(client, commandId)
}
func (s *service) SetTimerDisabled(commandId int) {
	s.timer.SetTimerDisabled(commandId)
}

func (s *service) GetTimerStatus(commandId int) bool {
	return s.timer.GetTimerStatus(commandId)
}

func (s *service) DeleteTimer(commandId int) {
	s.timer.DeleteTimer(commandId)
}

func (s *service) UpdateTimerContent(commandId int, commandContent string) {
	s.timer.UpdateTimerContent(commandId, commandContent)
}

func (s *service) GetCommandTimers(ctx context.Context, channelId string) ([]*model.CommandTimer, error) {
	return s.db.GetCommandTimers(ctx, platform.TWITCH, channelId)
}

func (s *service) CreateCommandTimer(ctx context.Context, channelId string, commandName string, interval int) (bool, error) {
	return s.db.CreateCommandTimer(ctx, platform.TWITCH, channelId, commandName, interval)
}

func (s *service) GetCommandTimer(ctx context.Context, channelId string, commandName string) *model.CommandTimer {
	return s.db.GetCommandTimer(ctx, platform.TWITCH, channelId, commandName)
}

func (s *service) UpdateCommandTimer(ctx context.Context, channelId string, commandName string, interval int, status int) error {
	return s.db.UpdateCommandTimer(ctx, platform.TWITCH, channelId, commandName, interval, status)
}

func (s *service) DeleteCommandTimer(ctx context.Context, channelId string, commandName string) error {
	return s.db.DeleteCommandTimer(ctx, platform.TWITCH, channelId, commandName)
}

func (s *service) UpdateCommandTimerInterval(commandId, interval int) {
	s.timer.UpdateCommandTimerInterval(commandId, interval)
}

func (s *service) GetCommandVariable(ctx context.Context, varName string, botPlatformId string) (*model.BotCommandVariable, error) {
	return s.db.GetCommandVariable(ctx, varName, platform.TWITCH, botPlatformId)
}

func (s *service) CreateCommandVariable(ctx context.Context, varName string, varContent string, botPlatformId string, createdBy string) error {
	return s.db.CreateCommandVariable(ctx, varName, varContent, platform.TWITCH, botPlatformId, createdBy)
}

func (s *service) UpdateCommandVariable(ctx context.Context, varName string, varContent string, botPlatformId string, updatedBy string) error {
	return s.db.UpdateCommandVariable(ctx, varName, varContent, platform.TWITCH, botPlatformId, updatedBy)
}

func (s *service) DeleteCommandVariable(ctx context.Context, varName string, botPlatformId string, updatedBy string) error {
	return s.db.DeleteCommandVariable(ctx, varName, platform.TWITCH, botPlatformId, updatedBy)
}

func (s *service) ListCommandVariables(ctx context.Context, botPlatformId string) ([]*model.BotCommandVariable, error) {
	return s.db.ListCommandVariables(ctx, platform.TWITCH, botPlatformId)
}

func (s *service) GetCustomVariableContent(ctx context.Context, botPlatformId string, varName string) string {
	return s.db.GetCustomVariableContent(ctx, platform.TWITCH, botPlatformId, varName)
}

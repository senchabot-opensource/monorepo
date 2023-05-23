package server

import (
	"context"
	"fmt"

	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/backend"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/models"
)

type SenchabotAPIServer struct {
	backend backend.Backend
}

func NewSenchabotAPIServer(backend backend.Backend) *SenchabotAPIServer {
	return &SenchabotAPIServer{backend: backend}
}

func (s *SenchabotAPIServer) GetTwitchChannels(ctx context.Context) ([]*models.TwitchChannel, error) {
	twitchChannels, err := s.backend.GetTwitchChannels(ctx)
	if err != nil {
		return nil, err
	}

	return twitchChannels, nil
}

func (s *SenchabotAPIServer) CreateTwitchChannel(ctx context.Context, channelId string, channelName string) (bool, error) {
	alreadyJoined, err := s.backend.CreateTwitchChannel(ctx, channelId, channelName, nil)
	if err != nil {
		return false, err
	}

	return alreadyJoined, nil
}

func (s *SenchabotAPIServer) GetTwitchBotConfig(ctx context.Context, twitchChannelId string, configKey string) (*models.TwitchBotConfig, error) {
	configData, err := s.backend.GetTwitchBotConfig(ctx, twitchChannelId, configKey)
	if err != nil {
		return nil, err
	}

	return configData, nil
}

func (s *SenchabotAPIServer) CheckConfig(ctx context.Context, twitchChannelId string, configKey string, configValue string) bool {
	configData, err := s.backend.GetTwitchBotConfig(ctx, twitchChannelId, configKey)
	if err != nil {
		fmt.Println(err.Error())
		return false
	}

	if configData != nil && configData.Value == configValue {
		return true
	}

	return false
}

func (s *SenchabotAPIServer) GetBotCommand(ctx context.Context, commandName string, twitchChannelId string) (*models.BotCommand, error) {
	commandData, err := s.backend.GetBotCommand(ctx, commandName, twitchChannelId)
	if err != nil {
		return nil, err
	}

	return commandData, nil
}

func (s *SenchabotAPIServer) CreateBotCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string, createdBy string) (*string, error) {
	infoText, err := s.backend.CreateBotCommand(ctx, commandName, commandContent, twitchChannelId, createdBy)
	if err != nil {
		return nil, err
	}

	return infoText, nil
}

func (s *SenchabotAPIServer) CheckCommandExists(ctx context.Context, commandName string, twitchChannelId string) (*string, error) {
	existCommandName, err := s.backend.CheckCommandExists(ctx, commandName, twitchChannelId)
	if err != nil {
		return nil, err
	}

	return existCommandName, nil
}

func (s *SenchabotAPIServer) UpdateBotCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string, updatedBy string) (*string, *string, error) {
	updatedCommandName, infoText, err := s.backend.UpdateBotCommand(ctx, commandName, commandContent, twitchChannelId, updatedBy)
	if err != nil {
		return nil, nil, err
	}

	return updatedCommandName, infoText, nil
}

func (s *SenchabotAPIServer) DeleteBotCommand(ctx context.Context, commandName string, twitchChannelId string) (*string, *string, error) {
	deletedCommandName, infoText, err := s.backend.DeleteBotCommand(ctx, commandName, twitchChannelId)
	if err != nil {
		return nil, nil, err
	}

	return deletedCommandName, infoText, nil
}

func (s *SenchabotAPIServer) CreateBotActionActivity(ctx context.Context, botPlatformType string, botActivity string, twitchChannelId string, activityAuthor string) error {
	err := s.backend.CreateBotActionActivity(ctx, botPlatformType, botActivity, twitchChannelId, activityAuthor)

	if err != nil {
		return err
	}

	return nil
}

func (s *SenchabotAPIServer) SaveBotCommandActivity(context context.Context, commandName string, twitchChannelId string, commandAuthor string) {
	check := s.CheckConfig(context, twitchChannelId, "bot_activity_enabled", "1")
	if !check {
		return
	}

	commandName = "!" + commandName

	if err := s.CreateBotActionActivity(context, "twitch", commandName, twitchChannelId, commandAuthor); err != nil {
		fmt.Println(err.Error())
	}
}

func (s *SenchabotAPIServer) CreateCommandAliases(ctx context.Context, commandName string, aliases []string, twitchChannelId string, createdBy string) (*string, error) {
	infoText, err := s.backend.CreateCommandAliases(ctx, commandName, aliases, twitchChannelId, createdBy)
	if err != nil {
		return nil, err
	}

	return infoText, nil
}

func (s *SenchabotAPIServer) GetCommandAlias(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error) {
	command, err := s.backend.GetCommandAlias(ctx, commandAlias, twitchChannelId)
	if err != nil {
		return nil, err
	}

	return command, nil
}

func (s *SenchabotAPIServer) DeleteCommandAlias(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error) {
	infoText, err := s.backend.DeleteCommandAlias(ctx, commandAlias, twitchChannelId)
	if err != nil {
		return nil, err
	}

	return infoText, nil
}

package server

import (
	"context"

	"github.com/senchabot-dev/monorepo/apps/bot/twitch/internal/backend"
	"github.com/senchabot-dev/monorepo/apps/bot/twitch/internal/models"
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

func (s *SenchabotAPIServer) GetBotCommand(ctx context.Context, commandName string, twitchChannelId string) (*models.BotCommand, error) {
	commandData, err := s.backend.GetBotCommand(ctx, commandName, twitchChannelId)
	if err != nil {
		return nil, err
	}

	return commandData, nil
}

func (s *SenchabotAPIServer) CreateBotCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string) (bool, error) {
	commandExists, err := s.backend.CreateBotCommand(ctx, commandName, commandContent, twitchChannelId)
	if err != nil {
		return false, err
	}

	return commandExists, nil
}

func (s *SenchabotAPIServer) UpdateBotCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string) error {
	err := s.backend.UpdateBotCommand(ctx, commandName, commandContent, twitchChannelId)
	if err != nil {
		return err
	}

	return nil
}

func (s *SenchabotAPIServer) DeleteBotCommand(ctx context.Context, commandName string, twitchChannelId string) error {
	err := s.backend.DeleteBotCommand(ctx, commandName, twitchChannelId)
	if err != nil {
		return err
	}

	return nil
}

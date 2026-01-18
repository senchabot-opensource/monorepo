package service

import (
	"context"
	"errors"
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/service/timer"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/service/webhook"
	"github.com/senchabot-opensource/monorepo/db"
	"github.com/senchabot-opensource/monorepo/model"
	"github.com/senchabot-opensource/monorepo/pkg/twitchapi"
	"github.com/senchabot-opensource/monorepo/platform"
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

	AddBotCommandStatistic(ctx context.Context, commandName string)

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

	AddStreamerToTwitchCommunity(ctx context.Context, communityName, communityCreatorChannelId, channelId string) error
	SubscribeToTwitchCommunity(ctx context.Context, communityName, channelId string) error
	GetTwitchCommunitySubscription(ctx context.Context, channelId string) (*model.TwitchCommunitySubscription, error)
	GetRandomLiveStreamer(ctx context.Context, communityId uint) (*string, error)
	RemoveStreamerFromTwitchCommunity(ctx context.Context, communityName, streamerId string) error
	UnsubscribeFromTwitchCommunity(ctx context.Context, communityName, channelId string) error
	CheckStreamerExistInCommunity(ctx context.Context, communityName string, channelId string) (bool, error)
	//ListTwitchCommunityMembers(ctx context.Context, communityName string) ([]*model.TwitchUserInfo, error)

	// Command Variable methods
	GetCommandVariable(ctx context.Context, varName string, botPlatformId string) (*model.BotCommandVariable, error)
	CreateCommandVariable(ctx context.Context, varName string, varContent string, botPlatformId string, createdBy string) error
	UpdateCommandVariable(ctx context.Context, varName string, varContent string, botPlatformId string, updatedBy string) error
	DeleteCommandVariable(ctx context.Context, varName string, botPlatformId string, updatedBy string) error
	ListCommandVariables(ctx context.Context, botPlatformId string) ([]*model.BotCommandVariable, error)
	GetCustomVariableContent(ctx context.Context, botPlatformId string, varName string) string

	GetAllTwitchCommunitySubscriptions(ctx context.Context, channelId string) ([]*model.TwitchCommunitySubscription, error)
	GetTwitchCommunityById(ctx context.Context, communityId uint) (*model.TwitchCommunity, error)
	GetTwitchCommunityByCreatorId(ctx context.Context, channelId string) (*model.TwitchCommunity, error)
	GetAllTwitchCommunityMembers(ctx context.Context, communityId uint) ([]*model.TwitchCommunityMember, error)
}

type service struct {
	timer         timer.Timer
	DB            db.Database
	webhook       webhook.Webhook
	twitchService twitchapi.TwitchService
}

func New(db db.Database, twitchService twitchapi.TwitchService) Service {
	return &service{
		DB:            db,
		webhook:       webhook.NewWebhook(db, twitchService),
		twitchService: twitchService,
		timer:         timer.NewTimer(),
	}
}

func (s *service) BotJoinWebhook(client *client.Clients, joinedChannelList []string, w http.ResponseWriter, r *http.Request) {
	s.webhook.BotJoin(client, joinedChannelList, w, r)
}

func (s *service) BotDepartWebhook(client *client.Clients, joinedChannelList []string, w http.ResponseWriter, r *http.Request) {
	s.webhook.BotDepart(client, joinedChannelList, w, r)
}

func (s *service) GetTwitchChannels(ctx context.Context) ([]*model.TwitchChannel, error) {
	twitchChannels, err := s.DB.GetTwitchChannels(ctx)
	if err != nil {
		return nil, err
	}

	return twitchChannels, nil
}

func (s *service) CreateTwitchChannel(ctx context.Context, channelId string, channelName string, userId *string) (bool, error) {
	alreadyJoined, err := s.DB.CreateTwitchChannel(ctx, channelId, channelName, userId)
	if err != nil {
		return false, err
	}

	return alreadyJoined, nil
}

func (s *service) DeleteTwitchChannel(ctx context.Context, channelId string, userId *string) (bool, error) {
	deleted, err := s.DB.DeleteTwitchChannel(ctx, channelId, userId)
	if err != nil {
		return false, err
	}

	return deleted, nil
}

func (s *service) GetTwitchBotConfig(ctx context.Context, twitchChannelId string, configKey string) (*model.TwitchBotConfig, error) {
	configData, err := s.DB.GetTwitchBotConfig(ctx, twitchChannelId, configKey)
	if err != nil {
		return nil, err
	}

	return configData, nil
}

func (s *service) CheckTwitchBotConfig(ctx context.Context, twitchChannelId string, configKey string, configValue string) bool {
	configData, err := s.DB.GetTwitchBotConfig(ctx, twitchChannelId, configKey)
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
	commandData, err := s.DB.GetGlobalBotCommand(ctx, commandName)
	if err != nil {
		return nil, err
	}

	return commandData, nil
}

func (s *service) GetUserBotCommand(ctx context.Context, commandName string, twitchChannelId string) (*model.BotCommand, error) {
	commandData, err := s.DB.GetUserBotCommand(ctx, platform.TWITCH, commandName, twitchChannelId)
	if err != nil {
		return nil, err
	}

	return commandData, nil
}

func (s *service) CreateCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string, createdBy string) (*string, error) {
	infoText, err := s.DB.CreateBotCommand(ctx, platform.TWITCH, commandName, commandContent, twitchChannelId, createdBy)
	if err != nil {
		return nil, err
	}

	return infoText, nil
}

func (s *service) CheckCommandExists(ctx context.Context, commandName string, twitchChannelId string) (*string, error) {
	existCommandName, err := s.DB.CheckCommandExists(ctx, platform.TWITCH, commandName, twitchChannelId)
	if err != nil {
		return nil, err
	}

	return existCommandName, nil
}

func (s *service) UpdateCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string, updatedBy string) (*string, *string, error) {
	updatedCommandName, infoText, err := s.DB.UpdateBotCommand(ctx, platform.TWITCH, commandName, commandContent, twitchChannelId, updatedBy)
	if err != nil {
		return nil, nil, err
	}

	return updatedCommandName, infoText, nil
}

func (s *service) DeleteCommand(ctx context.Context, commandName string, twitchChannelId string) (*string, *string, error) {
	deletedCommandName, infoText, err := s.DB.DeleteBotCommand(ctx, platform.TWITCH, commandName, twitchChannelId)
	if err != nil {
		return nil, nil, err
	}

	return deletedCommandName, infoText, nil
}

func (s *service) GetCommandList(ctx context.Context, twitchChannelId string) ([]*model.BotCommand, error) {
	cmdList, err := s.DB.GetCommandList(ctx, platform.TWITCH, twitchChannelId)
	if err != nil {
		return nil, err
	}

	return cmdList, nil
}

func (s *service) SaveCommandActivity(context context.Context, commandName string, twitchChannelId string, commandAuthor, commandAuthorId string) {
	check := s.CheckTwitchBotConfig(context, twitchChannelId, "bot_activity_enabled", "1")
	if !check {
		return
	}

	commandName = "!" + commandName

	if err := s.DB.CreateBotActionActivity(context, platform.TWITCH, commandName, twitchChannelId, commandAuthor, commandAuthorId); err != nil {
		log.Println("[service.SaveCommandActivity] CreateBotActionActivity Error:", err.Error())
	}
}

func (s *service) CreateCommandAlias(ctx context.Context, commandName string, aliases []string, twitchChannelId string, createdBy string) (*string, error) {
	infoText, err := s.DB.CreateCommandAlias(ctx, platform.TWITCH, commandName, aliases, twitchChannelId, createdBy)
	if err != nil {
		return nil, err
	}

	return infoText, nil
}

func (s *service) GetCommandAlias(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error) {
	command, err := s.DB.GetCommandAlias(ctx, platform.TWITCH, commandAlias, twitchChannelId)
	if err != nil {
		return nil, err
	}

	return command, nil
}

func (s *service) CheckCommandAliasExist(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error) {
	alias, err := s.DB.CheckCommandAliasExist(ctx, platform.TWITCH, commandAlias, twitchChannelId)

	if err != nil {
		return nil, err
	}

	return alias, nil
}

func (s *service) DeleteCommandAlias(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error) {
	infoText, err := s.DB.DeleteCommandAlias(ctx, platform.TWITCH, commandAlias, twitchChannelId)
	if err != nil {
		return nil, err
	}

	return infoText, nil
}

func (s *service) AddBotCommandStatistic(ctx context.Context, commandName string) {
	if err := s.DB.AddBotCommandStatistic(ctx, platform.TWITCH, commandName); err != nil {
		log.Println("[service.AddBotCommandStatistic] AddBotCommandStatistic error:", err.Error())
	}
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
	return s.DB.GetCommandTimers(ctx, platform.TWITCH, channelId)
}

func (s *service) CreateCommandTimer(ctx context.Context, channelId string, commandName string, interval int) (bool, error) {
	return s.DB.CreateCommandTimer(ctx, platform.TWITCH, channelId, commandName, interval)
}

func (s *service) GetCommandTimer(ctx context.Context, channelId string, commandName string) *model.CommandTimer {
	return s.DB.GetCommandTimer(ctx, platform.TWITCH, channelId, commandName)
}

func (s *service) UpdateCommandTimer(ctx context.Context, channelId string, commandName string, interval int, status int) error {
	return s.DB.UpdateCommandTimer(ctx, platform.TWITCH, channelId, commandName, interval, status)
}

func (s *service) DeleteCommandTimer(ctx context.Context, channelId string, commandName string) error {
	return s.DB.DeleteCommandTimer(ctx, platform.TWITCH, channelId, commandName)
}

func (s *service) UpdateCommandTimerInterval(commandId, interval int) {
	s.timer.UpdateCommandTimerInterval(commandId, interval)
}

func (s *service) CheckStreamerExistInCommunity(ctx context.Context, communityName string, channelId string) (bool, error) {
	community, err := s.DB.GetTwitchCommunity(ctx, communityName)
	if err != nil {
		log.Println("[service.CheckStreamerExistInCommunity] GetTwitchCommunity error:", err.Error())
		return true, err
	}

	if community == nil {
		community, err = s.DB.CreateTwitchCommunity(ctx, communityName, channelId)
		if err != nil {
			return true, err
		}

		err := s.DB.SubscribeToTwitchCommunity(ctx, community.ID, community.CreatorChannelID)
		if err != nil {
			return true, err
		}
	}

	return s.DB.CheckStreamerExistInCommunity(ctx, community.ID, channelId)
}

func (s *service) AddStreamerToTwitchCommunity(ctx context.Context, communityName, communityCreatorChannelId, channelId string) error {
	community, err := s.DB.GetTwitchCommunityByCreatorId(ctx, communityCreatorChannelId)
	if err != nil {
		log.Println("[service.AddStreamerToTwitchCommunity] GetTwitchCommunity error:", err.Error())
		return err
	}

	if community == nil {
		log.Println("[service.AddStreamerToTwitchCommunity] Community not found, creating new community")
		community, err = s.DB.CreateTwitchCommunity(ctx, communityName, communityCreatorChannelId)
		if err != nil {
			return err
		}

		err := s.DB.SubscribeToTwitchCommunity(ctx, community.ID, community.CreatorChannelID)
		if err != nil {
			return err
		}
	}

	log.Println("[service.AddStreamerToTwitchCommunity] Community:", community.CommunityName, community.CreatorChannelID, community.ID)

	log.Println("[service.AddStreamerToTwitchCommunity] Adding streamer to community")

	return s.DB.AddStreamerToTwitchCommunity(ctx, community.ID, channelId)
}

func (s *service) SubscribeToTwitchCommunity(ctx context.Context, communityName, channelId string) error {
	community, err := s.DB.GetTwitchCommunity(ctx, communityName)
	if err != nil {
		return err
	}

	if community == nil {
		return errors.New("Community not found")
	}

	return s.DB.SubscribeToTwitchCommunity(ctx, community.ID, channelId)
}

func (s *service) GetTwitchCommunitySubscription(ctx context.Context, channelId string) (*model.TwitchCommunitySubscription, error) {
	return s.DB.GetTwitchCommunitySubscription(ctx, channelId)
}

func (s *service) GetRandomLiveStreamer(ctx context.Context, communityId uint) (*string, error) {
	streamerIds, err := s.DB.GetStreamersFromTwitchCommunity(ctx, communityId)
	if err != nil {
		return nil, err
	}

	// Check which streamers are live
	var liveStreamers []string
	for _, streamerId := range streamerIds {
		isLive, _, err := s.twitchService.CheckStreamStatusById(streamerId)
		if err != nil {
			log.Println("[service.GetRandomLiveStreamer] CheckStreamStatus error:", err.Error())
			continue
		}
		log.Println("[service.GetRandomLiveStreamer] Streamer ID:", streamerId, isLive, err)

		if isLive {
			liveStreamers = append(liveStreamers, streamerId)
		}
	}

	if len(liveStreamers) == 0 {
		return nil, nil
	}

	// Return random live streamer
	rand.New(rand.NewSource(time.Now().UnixNano()))
	streamerId := liveStreamers[rand.Intn(len(liveStreamers))]
	log.Println("[service.GetRandomLiveStreamer] Streamer ID:", streamerId)

	return nil, nil
}

func (s *service) RemoveStreamerFromTwitchCommunity(ctx context.Context, communityName, streamerId string) error {
	community, err := s.DB.GetTwitchCommunity(ctx, communityName)
	if err != nil {
		return err
	}

	return s.DB.RemoveStreamerFromTwitchCommunity(ctx, community.ID, streamerId)
}

func (s *service) UnsubscribeFromTwitchCommunity(ctx context.Context, communityName, channelId string) error {
	community, err := s.DB.GetTwitchCommunity(ctx, communityName)
	if err != nil {
		return err
	}

	if community == nil {
		return errors.New("Community not found")
	}

	return s.DB.UnsubscribeFromTwitchCommunity(ctx, community.ID, channelId)
}

//func (s *service) ListTwitchCommunityMembers(ctx context.Context, communityName string) ([]*model.TwitchUserInfo, error) {
//return s.DB.ListTwitchCommunityMembers(ctx, communityName)
//}

func (s *service) GetCommandVariable(ctx context.Context, varName string, botPlatformId string) (*model.BotCommandVariable, error) {
	return s.DB.GetCommandVariable(ctx, varName, platform.TWITCH, botPlatformId)
}

func (s *service) CreateCommandVariable(ctx context.Context, varName string, varContent string, botPlatformId string, createdBy string) error {
	return s.DB.CreateCommandVariable(ctx, varName, varContent, platform.TWITCH, botPlatformId, createdBy)
}

func (s *service) UpdateCommandVariable(ctx context.Context, varName string, varContent string, botPlatformId string, updatedBy string) error {
	return s.DB.UpdateCommandVariable(ctx, varName, varContent, platform.TWITCH, botPlatformId, updatedBy)
}

func (s *service) DeleteCommandVariable(ctx context.Context, varName string, botPlatformId string, updatedBy string) error {
	return s.DB.DeleteCommandVariable(ctx, varName, platform.TWITCH, botPlatformId, updatedBy)
}

func (s *service) ListCommandVariables(ctx context.Context, botPlatformId string) ([]*model.BotCommandVariable, error) {
	return s.DB.ListCommandVariables(ctx, platform.TWITCH, botPlatformId)
}

func (s *service) GetCustomVariableContent(ctx context.Context, botPlatformId string, varName string) string {
	return s.DB.GetCustomVariableContent(ctx, platform.TWITCH, botPlatformId, varName)
}

func (s *service) GetAllTwitchCommunitySubscriptions(ctx context.Context, channelId string) ([]*model.TwitchCommunitySubscription, error) {
	return s.DB.GetAllTwitchCommunitySubscriptions(ctx, channelId)
}

func (s *service) GetTwitchCommunityById(ctx context.Context, communityId uint) (*model.TwitchCommunity, error) {
	return s.DB.GetTwitchCommunityById(ctx, communityId)
}

func (s *service) GetTwitchCommunityByCreatorId(ctx context.Context, channelId string) (*model.TwitchCommunity, error) {
	return s.DB.GetTwitchCommunityByCreatorId(ctx, channelId)
}

func (s *service) GetAllTwitchCommunityMembers(ctx context.Context, communityId uint) ([]*model.TwitchCommunityMember, error) {
	return s.DB.GetAllTwitchCommunityMembers(ctx, communityId)
}

package command

import (
	"context"
	"errors"
	"fmt"
	"log"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/model"
)

func (c *commands) AddChannelToTwitchCommunityCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*model.CommandResponse, error) {
	var cmdResp model.CommandResponse

	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], message.RoomID) {
		return nil, errors.New(message.User.DisplayName + config.CannotExecuteCommand)
	}

	log.Println("\n\n[command.AddChannelToTwitchCommunityCommand] message.RoomID:", message.RoomID)

	if len(params) != 1 {
		cmdResp.Message = "Usage: !addcm <twitch_username>"
		return &cmdResp, nil
	}

	uInfoCreator, err := c.twitchService.GetUserInfoById(message.RoomID)
	if err != nil {
		cmdResp.Message = fmt.Sprintf("There is something wrong.")
		return &cmdResp, nil
	}

	communityName := uInfoCreator.Login
	streamerName := strings.ToLower(strings.TrimPrefix(params[0], "@"))

	uInfo, err := c.twitchService.GetUserInfoByLoginName(streamerName)
	if err != nil {
		cmdResp.Message = fmt.Sprintf("Streamer %s not found", streamerName)
		return &cmdResp, nil
	}

	if message.RoomID == uInfo.ID {
		cmdResp.Message = fmt.Sprintf("You cannot add yourself to your own community.")
		return &cmdResp, nil
	}

	streamerExist, err := c.service.CheckStreamerExistInCommunity(context, communityName, uInfo.ID)
	if err != nil {
		return nil, err
	}

	if streamerExist {
		cmdResp.Message = fmt.Sprintf("Streamer %s already exists in Twitch community %s", streamerName, communityName)
		return &cmdResp, nil
	}

	err = c.service.AddStreamerToTwitchCommunity(context, communityName, message.RoomID, uInfo.ID)
	if err != nil {
		log.Println("failed to add streamer to community. error:", err.Error())
		return nil, err
	}

	cmdResp.Message = fmt.Sprintf("Added %s to Twitch community %s", streamerName, communityName)
	return &cmdResp, nil
}

func (c *commands) SubscribeToCommunityCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*model.CommandResponse, error) {
	var cmdResp model.CommandResponse

	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], message.RoomID) {
		return nil, errors.New(message.User.DisplayName + config.CannotExecuteCommand)
	}

	if len(params) != 1 {
		cmdResp.Message = "Usage: !subc <community_name>"
		return &cmdResp, nil
	}

	communityName := strings.ToLower(params[0])

	if communityName == message.Channel {
		cmdResp.Message = fmt.Sprintf("You cannot subscribe to your own community")
		return &cmdResp, nil
	}

	err := c.service.SubscribeToTwitchCommunity(context, communityName, message.RoomID)
	if err != nil {
		return nil, err
	}

	cmdResp.Message = fmt.Sprintf("Subscribed to Twitch community %s", communityName)
	return &cmdResp, nil
}

func (c *commands) RrCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*model.CommandResponse, error) {
	var cmdResp model.CommandResponse

	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], message.RoomID) {
		return nil, errors.New(message.User.DisplayName + config.CannotExecuteCommand)
	}

	communitySubscription, err := c.service.GetTwitchCommunitySubscription(context, message.RoomID)
	if err != nil {
		log.Println("[command.RrCommand] GetTwitchCommunitySubscription error:", err.Error())
		return nil, err
	}

	if communitySubscription == nil {
		cmdResp.Message = "No communities subscribed. Use !subc to subscribe to a community first."
		return &cmdResp, nil
	}

	// Get random live streamer from subscribed Twitch communities
	randomStreamerId, err := c.service.GetRandomLiveStreamer(context, communitySubscription.CommunityID)
	if err != nil {
		log.Println("[command.RrCommand] GetRandomLiveStreamer error:", err.Error())
		return nil, err
	}

	if randomStreamerId == nil {
		cmdResp.Message = "No live streamers found in subscribed communities"
		return &cmdResp, nil
	}

	responseText, err := c.twitchService.StartRaid(*randomStreamerId, message.RoomID)
	if err != nil {
		return nil, err
	}

	cmdResp.Message = *responseText
	return &cmdResp, nil
}

func (c *commands) UnraidCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*model.CommandResponse, error) {
	var cmdResp model.CommandResponse

	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], message.RoomID) {
		return nil, errors.New(message.User.DisplayName + config.CannotExecuteCommand)
	}

	responseText, err := c.twitchService.CancelRaid(message.RoomID)
	if err != nil {
		return nil, err
	}

	cmdResp.Message = *responseText
	return &cmdResp, nil
}

func (c *commands) UnsubscribeFromCommunityCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*model.CommandResponse, error) {
	var cmdResp model.CommandResponse

	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], message.RoomID) {
		return nil, errors.New(message.User.DisplayName + config.CannotExecuteCommand)
	}

	if len(params) != 1 {
		cmdResp.Message = "Usage: !unsubc <community_name>"
		return &cmdResp, nil
	}

	communityName := strings.ToLower(params[0])

	err := c.service.UnsubscribeFromTwitchCommunity(context, communityName, message.RoomID)
	if err != nil {
		return nil, err
	}

	cmdResp.Message = fmt.Sprintf("Unsubscribed from Twitch community %s", communityName)
	return &cmdResp, nil
}

// add remove community member command
func (c *commands) RemoveCommunityMemberCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*model.CommandResponse, error) {
	var cmdResp model.CommandResponse

	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], message.RoomID) {
		return nil, errors.New(message.User.DisplayName + config.CannotExecuteCommand)
	}

	if len(params) != 1 {
		cmdResp.Message = "Usage: !delcm <twitch_username>"
		return &cmdResp, nil
	}

	communityName := message.User.Name
	streamerName := strings.ToLower(strings.TrimPrefix(params[0], "@"))

	err := c.service.RemoveStreamerFromTwitchCommunity(context, communityName, streamerName)
	if err != nil {
		return nil, err
	}

	cmdResp.Message = fmt.Sprintf("Removed %s from Twitch community %s", streamerName, communityName)
	return &cmdResp, nil
}

func (c *commands) ListSubscribedCommunitiesCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*model.CommandResponse, error) {
	var cmdResp model.CommandResponse

	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], message.RoomID) {
		return nil, errors.New(message.User.DisplayName + config.CannotExecuteCommand)
	}

	// Get all community subscriptions for this channel
	subscriptions, err := c.service.GetAllTwitchCommunitySubscriptions(context, message.RoomID)
	if err != nil {
		cmdResp.Message = "Error retrieving community subscriptions"
		return &cmdResp, nil
	}

	if len(subscriptions) == 0 {
		cmdResp.Message = "No communities subscribed. Use !subc <community_name> to subscribe to a community."
		return &cmdResp, nil
	}

	var communityNames []string
	for _, sub := range subscriptions {
		community, err := c.service.GetTwitchCommunityById(context, sub.CommunityID)
		if err != nil {
			continue
		}
		communityNames = append(communityNames, community.CommunityName)
	}

	cmdResp.Message = fmt.Sprintf("Subscribed communities: %s", strings.Join(communityNames, ", "))
	return &cmdResp, nil
}

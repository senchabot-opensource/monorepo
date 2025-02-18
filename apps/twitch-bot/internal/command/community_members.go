package command

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/config"
	"github.com/senchabot-opensource/monorepo/model"
)

func (c *commands) CommunityMembersCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*model.CommandResponse, error) {
	var cmdResp model.CommandResponse

	if !helpers.CanExecuteCommand(context, c.service, message.Tags["badges"], message.RoomID) {
		return nil, errors.New(message.User.DisplayName + config.CannotExecuteCommand)
	}

	// Get community info
	community, err := c.service.GetTwitchCommunityByCreatorId(context, message.RoomID)
	if err != nil {
		cmdResp.Message = fmt.Sprintf("Error retrieving community information for %s", message.RoomID)
		return &cmdResp, nil
	}

	if community == nil {
		cmdResp.Message = fmt.Sprintf("Community not found for this channel")
		return &cmdResp, nil
	}

	// Get community members
	members, err := c.service.GetAllTwitchCommunityMembers(context, community.ID)
	if err != nil {
		cmdResp.Message = "Error retrieving community members"
		return &cmdResp, nil
	}

	if len(members) == 0 {
		cmdResp.Message = fmt.Sprintf("No members found in your community")
		return &cmdResp, nil
	}

	var memberNames []string
	for _, member := range members {
		userInfo, err := c.twitchService.GetUserInfoById(member.MemberChannelID)
		if err != nil {
			continue
		}
		memberNames = append(memberNames, userInfo.Login)
	}

	cmdResp.Message = fmt.Sprintf("Members in your community: %s", strings.Join(memberNames, ", "))
	return &cmdResp, nil
}

package helpers

import (
	"context"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/model"
)

func GetCommandVariables(cmdData *model.BotCommand, message twitch.PrivateMessage) *model.CommandVariable {
	return &model.CommandVariable{
		CommandContent:   cmdData.CommandContent,
		UserName:         message.User.DisplayName,
		CurrentDate:      &message.Time,
		CommandCreatedAt: cmdData.CreatedAt,
		ChannelName:      message.Channel,
	}
}

func CanExecuteCommand(context context.Context, service service.Service, badges string, twitchChannelId string) bool {
	// broadcaster can run the command
	if isBroadcaster(badges) {
		return true
	}

	// moderator can run the command
	if isModerator(badges) {
		check := service.CheckTwitchBotConfig(context, twitchChannelId, "mods_manage_cmds_enabled", "1")
		return check
	}

	// everyone else can't run the command
	return false
}

func isBroadcaster(badgeTags string) bool {
	return strings.Contains(badgeTags, "broadcaster")
}

func isModerator(badgeTags string) bool {
	return strings.Contains(badgeTags, "moderator")
}

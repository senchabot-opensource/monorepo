package helpers

import (
	"context"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/model"
	"github.com/senchabot-opensource/monorepo/platform"
)

func GetCommandVariables(cmdData *model.BotCommand, message twitch.PrivateMessage) *model.CommandVariable {
	return &model.CommandVariable{
		CommandContent:   cmdData.CommandContent,
		UserName:         message.User.DisplayName,
		CurrentDate:      &message.Time,
		CommandCreatedAt: cmdData.CreatedAt,
		ChannelName:      message.Channel,
		BotPlatform:      platform.TWITCH,
		BotPlatformID:    message.RoomID,
	}
}

func AreCommandAndMentionIndicesInvalid(cmdIndex int, mentionIndex int) bool {
	return cmdIndex < 0 || cmdIndex > 1 || mentionIndex > 1
}

func AreCommandAndMentionIndicesMismatched(cmdIndex int, mentionIndex int) bool {
	return cmdIndex+1 != mentionIndex && mentionIndex+1 != cmdIndex
}

func ParseMessage(message string) (string, []string) {
	words := strings.Fields(message)
	cmdIndex, mentionIndex := FindCommandAndMentionIndices(words)

	if AreCommandAndMentionIndicesInvalid(cmdIndex, mentionIndex) {
		return "", nil
	}

	// 0 and 1 indexes, if there is no mention, the command cannot be placed in any index other than 0.
	if AreCommandAndMentionIndicesMismatched(cmdIndex, mentionIndex) {
		return "", nil
	}

	cmdName := words[cmdIndex]
	params := words[cmdIndex+1:]

	// wykonos
	cmdName = strings.TrimPrefix(cmdName, "!")

	if mentionIndex < 0 {
		return cmdName, params
	}

	mention := words[mentionIndex]

	return cmdName, []string{mention}
}

func FindCommandAndMentionIndices(words []string) (int, int) {
	cmdIndex := -1
	mentionIndex := -1
	for i, v := range words {
		if strings.HasPrefix(v, "!") && cmdIndex < 0 {
			cmdIndex = i
		}
		if strings.HasPrefix(v, "@") && mentionIndex < 0 {
			mentionIndex = i
		}
	}

	return cmdIndex, mentionIndex
}

func ParseSysCmdMessage(message string) (string, []string) {
	var cmdName string

	splitMsg := strings.Split(message, " ")
	if !strings.HasPrefix(splitMsg[0], "!") {
		return "", nil
	}

	cmdName = splitMsg[0]
	params := splitMsg[1:]

	// wykonos
	cmdName = strings.TrimPrefix(cmdName, "!")

	return cmdName, params
}

func FindCommandIndices(words []string) int {
	cmdIndex := -1
	for i, v := range words {
		if strings.HasPrefix(v, "!") && cmdIndex < 0 {
			cmdIndex = i
		}
	}

	return cmdIndex
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

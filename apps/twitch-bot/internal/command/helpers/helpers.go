package helpers

import (
	"context"
	"fmt"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

const (
	maxCommandNameLength    = 50
	maxCommandContentLength = 400
)

func GetCommandVariables(cmdData *models.BotCommand, message twitch.PrivateMessage) *models.CommandVariable {
	return &models.CommandVariable{
		CommandContent:   cmdData.CommandContent,
		UserName:         message.User.DisplayName,
		CurrentDate:      &message.Time,
		CommandCreatedAt: cmdData.CreatedAt,
		ChannelName:      message.Channel,
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

func GetCommandCreateUpdateParams(params []string) (string, string, bool) {
	if check := gosenchabot.ValidateCommandCreateParamsLength(params); !check {
		return "", "", false
	}

	var commandName = strings.ToLower(params[0])
	var commandContent = strings.Join(params[1:], " ")

	commandName = gosenchabot.TrimExclamationPrefix(commandName)

	return commandName, commandContent, true
}

func ValidateCommandCreateParams(commandName string, commandContent string) (string, bool) {
	if len(commandName) > maxCommandNameLength {
		return fmt.Sprintf("Command Name length must be no more than %d chars", maxCommandNameLength), false
	}
	if infoText, check := ValidateCommandContentLength(commandContent); !check {
		return infoText, check
	}

	return "", true
}

func ValidateCommandContentLength(commandContent string) (string, bool) {
	if len(commandContent) > maxCommandContentLength {
		return fmt.Sprintf("Command Content length must be no more than %d chars", maxCommandContentLength), false
	}

	return "", true
}

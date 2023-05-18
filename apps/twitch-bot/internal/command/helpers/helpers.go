package helpers

import (
	"context"
	"math/rand"
	"strconv"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/models"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/server"
)

var (
	max = 70
	min = 18
)

func FormatCommandContent(commandData *models.BotCommand, message twitch.PrivateMessage) string {
	msgContent := commandData.CommandContent

	userName := message.User.DisplayName
	dateTemplate := "02/01/2006"

	stringTemplates := map[string]string{
		"{user.name}":     userName,
		"{cmd.author}":    userName,
		"{random_number}": strconv.Itoa(rand.Intn(max-min) + min),
		"{date}":          message.Time.Format(dateTemplate),
		"{cmd.date}":      commandData.CreatedAt.Format(dateTemplate),

		// we will keep these old string templates used in commands for a while for backward compatibility.
		"{user_name}": userName,
		"{cmd_date}":  commandData.CreatedAt.Format(dateTemplate),
	}

	for k, v := range stringTemplates {
		msgContent = strings.ReplaceAll(msgContent, k, v)
	}

	return msgContent
}

func CanExecuteCommand(context context.Context, server *server.SenchabotAPIServer, message twitch.PrivateMessage) bool {
	// broadcaster can run the command
	if isBroadcaster(message.Tags["badges"]) {
		return true
	}

	// moderator can run the command
	if isModerator(message.Tags["badges"]) {
		check := server.CheckConfig(context, message.RoomID, "mods_manage_cmds_enabled", "1")
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

func MakeUniqueArray(stringSlice []string) []string {
	keys := make(map[string]bool)
	list := []string{}
	for _, entry := range stringSlice {
		if _, value := keys[entry]; !value {
			keys[entry] = true
			list = append(list, entry)
		}
	}
	return list
}

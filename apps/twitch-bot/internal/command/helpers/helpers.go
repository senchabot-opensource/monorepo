package helpers

import (
	"math/rand"
	"strconv"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/models"
)

var (
	max = 70
	min = 18
)

func FormatCommandContent(commandData *models.BotCommand, message twitch.PrivateMessage) string {
	msgContent := commandData.CommandContent
	msgContent = strings.ReplaceAll(msgContent, "{user_name}", message.User.DisplayName)
	msgContent = strings.ReplaceAll(msgContent, "{random_number}", strconv.Itoa(rand.Intn(max-min)+min))
	msgContent = strings.ReplaceAll(msgContent, "{date}", message.Time.Format("2006-01-02"))
	msgContent = strings.ReplaceAll(msgContent, "{cmd_date}", commandData.CreatedAt.Format("2006-01-02"))

	return msgContent
}

func CanExecuteCommand(message twitch.PrivateMessage) bool {
	// broadcaster can run the command
	if isBroadcaster(message.Tags["badges"]) {
		return true
	}

	// moderator can run the command
	if isModerator(message.Tags["badges"]) {
		return true
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

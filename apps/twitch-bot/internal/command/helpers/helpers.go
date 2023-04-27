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

	userName := message.User.DisplayName
	dateTemplate := "02/01/2006"

	stringTemplates := map[string]string{
		"{user.name}":     userName,
		"{cmd.author}":    userName,
		"{random_number}": strconv.Itoa(rand.Intn(max-min) + min),
		"{date}":          message.Time.Format(dateTemplate),
		"{cmd.date}":      commandData.CreatedAt.Format(dateTemplate),
	}

	for k, v := range stringTemplates {
		msgContent = strings.ReplaceAll(msgContent, k, v)
	}

	return msgContent
}

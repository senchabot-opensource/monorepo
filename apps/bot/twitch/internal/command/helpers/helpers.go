package helpers

import (
	"math/rand"
	"strconv"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
)

var (
	max = 70
	min = 18
)

func FormatCommandContent(commandContent string, message twitch.PrivateMessage) string {
	commandContent = strings.ReplaceAll(commandContent, "{user_name}", message.User.DisplayName)
	commandContent = strings.ReplaceAll(commandContent, "{random_number}", strconv.Itoa(rand.Intn(max-min)+min))

	return commandContent
}

package helpers

import (
	"fmt"
	"regexp"
	"strings"

	"github.com/senchabot-opensource/monorepo/apps/discord-bot/client"
)

func GetURL(domain, messageContent string) string {
	pattern := fmt.Sprintf(`%s\S*`, domain)
	re := regexp.MustCompile(pattern)
	match := re.FindString(messageContent)

	if match != "" {
		return "https://" + match
	}

	return ""
}

func ParseTwitchUsernameURLParam(str string) string {
	pattern := `^(?:https?:\/\/)?(?:www\.)?twitch\.tv\/([a-zA-Z0-9_]+)$`
	re := regexp.MustCompile(pattern)
	matches := re.FindStringSubmatch(str)

	if len(matches) > 1 {
		return matches[1]
	}

	return str
}

func FormatContent(str string, sd client.StreamerData) string {
	if sd.StreamGame == "" {
		sd.StreamGame = "Just Chatting"
	}

	stringTemplates := map[string]string{
		"{twitch.username}": sd.UserName,
		"{twitch.url}":      "https://www.twitch.tv/" + sd.UserLogin,
		"{stream.title}":    sd.Title,
		"{stream.category}": sd.StreamGame,
	}

	for k, v := range stringTemplates {
		str = strings.ReplaceAll(str, k, v)
	}

	return str
}

func ParseMessage(message string) (string, []string) {
	var splitMsg = strings.Split(message, " ")
	var cmdName = splitMsg[0]

	params := splitMsg[1:]

	if !CheckIfCommand(cmdName) {
		return "", nil
	}

	cmdName = strings.TrimPrefix(cmdName, "!")

	return cmdName, params
}

func CheckIfCommand(param string) bool {
	return strings.HasPrefix(param, "!")
}

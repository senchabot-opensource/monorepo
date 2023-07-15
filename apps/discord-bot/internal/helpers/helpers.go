package helpers

import (
	"fmt"
	"regexp"
	"strings"

	"github.com/senchabot-dev/monorepo/apps/discord-bot/client"
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

	fmt.Println("matches", matches)

	if len(matches) > 1 {
		return matches[1]
	}

	return str
}

func FormatContent(str string, sd client.StreamerData) string {

	stringTemplates := map[string]string{
		"{stream.user}":     sd.UserLogin,
		"{stream.title}":    sd.Title,
		"{stream.url}":      "https://www.twitch.tv/" + sd.UserLogin,
		"{stream.category}": sd.StreamGame,
	}

	for k, v := range stringTemplates {
		str = strings.ReplaceAll(str, k, v)
	}

	return str
}

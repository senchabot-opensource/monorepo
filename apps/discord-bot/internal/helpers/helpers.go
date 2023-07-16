package helpers

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
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

func IsCommandParamsLengthEqualToOne(params []string) bool {
	return len(params) == 1
}

type SozlukGraphQLResponse struct {
	Data struct {
		Sozluk struct {
			Term struct {
				Title string `json:"title"`
				Body  struct {
					Raw string `json:"raw"`
				} `json:"body"`
			} `json:"term"`
		} `json:"sozluk"`
	} `json:"data"`
}

func FetchGraphQL(apiUrl string, query string) ([]byte, error) {
	queryParams := url.QueryEscape(query)
	fullURL := fmt.Sprintf("%s?query=%s", apiUrl, queryParams)

	resp, err := http.Get(fullURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return body, nil
}

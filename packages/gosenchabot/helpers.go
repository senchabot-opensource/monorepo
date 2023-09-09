package gosenchabot

import (
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"regexp"
	"strconv"
	"strings"
	"time"
)

const maxAliasParamLength = 4

func GetAliasCommandCreateParams(params []string) (string, []string, bool) {
	if check := ValidateCommandCreateParamsLength(params); !check {
		return "", nil, false
	}

	command := strings.ToLower(params[0])
	params = params[1:]

	command = TrimExclamationPrefix(command)
	aliasCommands := MakeUniqueArray(params)

	return command, aliasCommands, true
}

func ValidateCommandCreateParamsLength(params []string) bool {
	return len(params) >= 2
}

func ValidateAliasCommandsLength(aliasCommands []string) (string, bool) {
	if len(aliasCommands) > maxAliasParamLength {
		return fmt.Sprintf("Command Aliases length must be no more than %d", maxAliasParamLength), false
	}

	return "", true
}

func MakeUniqueArray(stringSlice []string) []string {
	keys := make(map[string]bool)
	list := []string{}
	for _, entry := range stringSlice {
		if _, value := keys[entry]; !value {
			keys[entry] = true
			entry = TrimExclamationPrefix(entry)
			list = append(list, entry)
		}
	}
	return list
}

func IsCommandParamsLengthEqualToOne(params []string) bool {
	return len(params) == 1
}

func GetProcessedCommandName(cmdName string) string {
	cmdName = strings.ToLower(cmdName)
	cmdName = TrimExclamationPrefix(cmdName)
	return cmdName
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

func TrimExclamationPrefix(commandName string) string {
	return strings.TrimPrefix(commandName, "!")
}

func CheckIfCommand(param string) bool {
	return strings.HasPrefix(param, "!")
}

func CheckTimeOlderThan(msgTimestamp time.Time, tNumber int) bool {
	return int(time.Until(msgTimestamp).Abs().Hours()) < tNumber
}

func ContainsLowerCase(s string, substr string) bool {
	return strings.Contains(strings.ToLower(s), substr)
}

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

func StrToInt(intervalStr string) (int, error) {
	interval, err := strconv.Atoi(intervalStr)
	if err != nil {
		log.Println("strconv.Atoi err", err)
		return 0, errors.New("the interval value must be integer")
	}

	return interval, nil
}

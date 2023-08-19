package gosenchabot

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
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

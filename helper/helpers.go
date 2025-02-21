package helper

import (
	"context"
	"errors"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"net/url"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/senchabot-opensource/monorepo/model"
	"github.com/senchabot-opensource/monorepo/service"
)

const (
	max = 70
	min = 18

	maxAliasParamLength = 4

	maxCommandNameLength    = 50
	MaxCommandContentLength = 400
)

func FormatCommandContent(cv *model.CommandVariable, service service.Service) string {
	msgContent := cv.CommandContent
	username := cv.UserName
	dateTemplate := "02/01/2006"

	stringTemplates := map[string]string{
		"{user.name}":     username,
		"{cmd.author}":    username,
		"{random_number}": strconv.Itoa(rand.Intn(max-min) + min),
		"{date}":          cv.CurrentDate.Format(dateTemplate),
		"{cmd.date}":      cv.CommandCreatedAt.Format(dateTemplate),
		"{channel.name}":  cv.ChannelName,

		// we will keep these old string templates used in commands for a while for backward compatibility.
		"{user_name}": username,
		"{cmd_date}":  cv.CommandCreatedAt.Format(dateTemplate),
	}

	for k, v := range stringTemplates {
		msgContent = strings.ReplaceAll(msgContent, k, v)
	}

	// Find and replace custom variables
	re := regexp.MustCompile(`{([^}]+)}`)
	matches := re.FindAllStringSubmatch(msgContent, -1)

	if matches != nil && cv.BotPlatform != "" && cv.BotPlatformID != "" {

		for _, match := range matches {
			if _, exists := stringTemplates[match[0]]; !exists {
				// This is a custom variable, look it up in the database
				variableContent := service.GetCustomVariableContent(context.Background(), cv.BotPlatformID, match[1])
				if variableContent != "" {
					msgContent = strings.ReplaceAll(msgContent, match[0], variableContent)
				}
			}

		}
	}

	url, startIndex, endIndex, ok := ParseCustomAPIURLFromMessage(msgContent)
	if ok {
		template := msgContent[startIndex : endIndex+1]
		response, err := SendGetRequest(url)
		if err != nil {
			log.Println("[FormatCommandContent] SendGetRequest error:", err.Error())
			msgContent = username + ", there was an error while sending get request"
		}

		msgContent = strings.Replace(msgContent, template, response, 1)
	}

	return msgContent
}

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
		return fmt.Sprintf("Command Aliases length must be no longer than %d", maxAliasParamLength), false
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

func removeTrailingPunctuationFromURL(s string) string {
	re := regexp.MustCompile(`[^_\w]+$`)
	return re.ReplaceAllString(s, "")
}

func GetURL(domain, messageContent string) string {
	pattern := fmt.Sprintf(`%s\S*`, domain)
	re := regexp.MustCompile(pattern)
	match := re.FindString(messageContent)

	if match != "" {
		match = removeTrailingPunctuationFromURL(match)
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

	return ""
}

func ParseCustomAPIURLFromMessage(message string) (string, int, int, bool) {
	startIndex := strings.Index(message, "{customapi.") // Curly braces start index
	endIndex := strings.LastIndex(message, "}")         // Curly braces end index
	if startIndex == -1 || endIndex == -1 || endIndex <= startIndex {
		return message, 0, 0, false
	}

	url := message[startIndex+1 : endIndex]
	url = strings.TrimPrefix(url, "customapi.")

	return url, startIndex, endIndex, true
}

func SendGetRequest(url string) (string, error) {
	response, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer response.Body.Close()

	body, err := io.ReadAll(response.Body)
	if err != nil {
		return "", err
	}
	return string(body), nil
}

func GetCommandCreateUpdateParams(params []string) (string, string, bool) {
	if check := ValidateCommandCreateParamsLength(params); !check {
		return "", "", false
	}

	var commandName = strings.ToLower(params[0])
	var commandContent = strings.Join(params[1:], " ")

	commandName = TrimExclamationPrefix(commandName)

	return commandName, commandContent, true
}

func ValidateCommandCreateParams(commandName string, commandContent string) (string, bool) {
	if len(commandName) > maxCommandNameLength {
		return fmt.Sprintf("Command Name length must be no longer than %d chars", maxCommandNameLength), false
	}
	if infoText, check := ValidateCommandContentLength(commandContent); !check {
		return infoText, check
	}

	return "", true
}

func ValidateCommandContentLength(commandContent string) (string, bool) {
	if len(commandContent) > MaxCommandContentLength {
		return fmt.Sprintf("Command Content length must be no longer than %d chars", MaxCommandContentLength), false
	}

	return "", true
}

func StrToInt(intervalStr string) (int, error) {
	interval, err := strconv.Atoi(intervalStr)
	if err != nil {
		log.Println("[StrToInt] Conversion error:", err)
		return 0, errors.New("the interval value must be integer")
	}

	return interval, nil
}

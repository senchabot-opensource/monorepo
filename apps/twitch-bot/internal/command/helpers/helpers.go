package helpers

import (
	"context"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"strconv"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/models"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/service"
)

var (
	max = 70
	min = 18
)

func FormatCommandContent(commandData *models.BotCommand, message twitch.PrivateMessage) string {
	msgContent := commandData.CommandContent

	userName := message.User.DisplayName
	dateTemplate := "02/01/2006"
	//curlyBracesPattern := regexp.MustCompile(`{(.*?)}`)

	stringTemplates := map[string]string{
		"{user.name}":     userName,
		"{cmd.author}":    userName,
		"{random_number}": strconv.Itoa(rand.Intn(max-min) + min),
		"{date}":          message.Time.Format(dateTemplate),
		"{cmd.date}":      commandData.CreatedAt.Format(dateTemplate),
		"{channel.name}":  message.Channel,

		// we will keep these old string templates used in commands for a while for backward compatibility.
		"{user_name}": userName,
		"{cmd_date}":  commandData.CreatedAt.Format(dateTemplate),
	}

	for k, v := range stringTemplates {
		msgContent = strings.ReplaceAll(msgContent, k, v)
	}

	url, startIndex, endIndex, ok := parseCustomAPIURLFromMessage(msgContent)
	if ok {
		template := msgContent[startIndex : endIndex+1]
		response, err := sendGetRequest(url)
		if err != nil {
			fmt.Println("parseCustomAPIURLFromMessage url, sendGetRequest Error:", err)
			msgContent = message.User.DisplayName + ", there was an error while sending get request"
		}

		msgContent = strings.Replace(msgContent, template, response, 1)
	}

	//msgContent = curlyBracesPattern.ReplaceAllString(msgContent, "$1")

	return msgContent
}

func parseCustomAPIURLFromMessage(message string) (string, int, int, bool) {
	startIndex := strings.Index(message, "{customapi.") // Curly braces start index
	endIndex := strings.LastIndex(message, "}")         // Curly braces end index
	if startIndex == -1 || endIndex == -1 || endIndex <= startIndex {
		return message, 0, 0, false
	}

	url := message[startIndex+1 : endIndex]
	url = strings.TrimPrefix(url, "customapi.")

	return url, startIndex, endIndex, true
}

func sendGetRequest(url string) (string, error) {
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

func ParseMessage(message string) (string, []string) {
	var splitMsg = strings.Split(message, " ")
	var cmdName = splitMsg[0]
	var params []string

	// Check if first word is a @mention
	if strings.HasPrefix(cmdName, "@") && len(params) > 2 {
		cmdName = splitMsg[1]
	} else {
		params = splitMsg[1:]
	}

	if !CheckIfCommand(cmdName) {
		return "", nil
	}

	cmdName = strings.TrimPrefix(cmdName, "!")

	return cmdName, params
}

func CheckIfCommand(param string) bool {
	return strings.HasPrefix(param, "!")
}

func CanExecuteCommand(context context.Context, service service.Service, message twitch.PrivateMessage) bool {
	// broadcaster can run the command
	if isBroadcaster(message.Tags["badges"]) {
		return true
	}

	// moderator can run the command
	if isModerator(message.Tags["badges"]) {
		check := service.CheckConfig(context, message.RoomID, "mods_manage_cmds_enabled", "1")
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
			entry = strings.TrimPrefix(entry, "!")
			list = append(list, entry)
		}
	}
	return list
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
	fmt.Println("ValidateCommandCreateParamsLength", params)
	return len(params) >= 2
}

func ValidateAliasCommandsLength(aliasCommands []string) (string, bool) {
	if len(aliasCommands) > 4 {
		return "Command Aliases length must be no more than 4", false
	}

	return "", true
}

func ValidateCommandCreateParams(commandName string, commandContent string) (string, bool) {
	if len(commandName) > 50 {
		return "Command Name length must be no more than 50 chars", false
	}
	if infoText, check := ValidateCommandContentLength(commandContent); !check {
		return infoText, check
	}

	return "", true
}

func ValidateCommandContentLength(commandContent string) (string, bool) {
	if len(commandContent) > 400 {
		return "Command Content length must be no more than 400 chars", false
	}

	return "", true
}

func ValidateCommandDeleteParamsLength(params []string) bool {
	return len(params) == 1
}

func TrimExclamationPrefix(commandName string) string {
	return strings.TrimPrefix(commandName, "!")
}

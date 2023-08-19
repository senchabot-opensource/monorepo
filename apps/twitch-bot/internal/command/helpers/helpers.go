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
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

const (
	max = 70
	min = 18

	maxCommandNameLength    = 50
	maxCommandContentLength = 400

	maxAliasParamLength = 4
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

func AreCommandAndMentionIndicesInvalid(cmdIndex int, mentionIndex int) bool {
	return cmdIndex < 0 || cmdIndex > 1 || mentionIndex > 1
}

func AreCommandAndMentionIndicesMismatched(cmdIndex int, mentionIndex int) bool {
	return cmdIndex+1 != mentionIndex && mentionIndex+1 != cmdIndex
}

func ParseMessage(message string) (string, []string) {
	words := strings.Fields(message)
	cmdIndex, mentionIndex := FindCommandAndMentionIndices(words)

	if AreCommandAndMentionIndicesInvalid(cmdIndex, mentionIndex) {
		return "", nil
	}

	// 0 and 1 indexes, if there is no mention, the command cannot be placed in any index other than 0.
	if AreCommandAndMentionIndicesMismatched(cmdIndex, mentionIndex) {
		return "", nil
	}

	cmdName := words[cmdIndex]
	params := words[cmdIndex+1:]

	// wykonos
	cmdName = strings.TrimPrefix(cmdName, "!")

	if mentionIndex < 0 {
		return cmdName, params
	}

	mention := words[mentionIndex]

	return cmdName, []string{mention}
}

func FindCommandAndMentionIndices(words []string) (int, int) {
	cmdIndex := -1
	mentionIndex := -1
	for i, v := range words {
		if strings.HasPrefix(v, "!") && cmdIndex < 0 {
			cmdIndex = i
		}
		if strings.HasPrefix(v, "@") && mentionIndex < 0 {
			mentionIndex = i
		}
	}

	return cmdIndex, mentionIndex
}

func CheckIfCommand(param string) bool {
	return strings.HasPrefix(param, "!")
}

func CanExecuteCommand(context context.Context, service service.Service, badges string, twitchChannelId string) bool {
	// broadcaster can run the command
	if isBroadcaster(badges) {
		return true
	}

	// moderator can run the command
	if isModerator(badges) {
		check := service.CheckConfig(context, twitchChannelId, "mods_manage_cmds_enabled", "1")
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

func GetCommandCreateUpdateParams(params []string) (string, string, bool) {
	if check := gosenchabot.ValidateCommandCreateParamsLength(params); !check {
		return "", "", false
	}

	var commandName = strings.ToLower(params[0])
	var commandContent = strings.Join(params[1:], " ")

	commandName = gosenchabot.TrimExclamationPrefix(commandName)

	return commandName, commandContent, true
}

func ValidateCommandCreateParams(commandName string, commandContent string) (string, bool) {
	if len(commandName) > maxCommandNameLength {
		return fmt.Sprintf("Command Name length must be no more than %d chars", maxCommandNameLength), false
	}
	if infoText, check := ValidateCommandContentLength(commandContent); !check {
		return infoText, check
	}

	return "", true
}

func ValidateCommandContentLength(commandContent string) (string, bool) {
	if len(commandContent) > maxCommandContentLength {
		return fmt.Sprintf("Command Content length must be no more than %d chars", maxCommandContentLength), false
	}

	return "", true
}

func IsCommandParamsLengthEqualToOne(params []string) bool {
	return len(params) == 1
}

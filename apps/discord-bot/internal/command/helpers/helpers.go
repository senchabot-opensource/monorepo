package helpers

import (
	"strings"

	"github.com/senchabot-opensource/monorepo/packages/gosenchabot"
)

func IsChannelNameNotGiven(optionsLen int) bool {
	return optionsLen < 2
}

func ParseMessage(message string) (string, []string) {
	var splitMsg = strings.Split(message, " ")
	var cmdName = splitMsg[0]

	params := splitMsg[1:]

	if !gosenchabot.CheckIfCommand(cmdName) {
		return "", nil
	}

	cmdName = strings.TrimPrefix(cmdName, "!")

	return cmdName, params
}

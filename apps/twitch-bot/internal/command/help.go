package command

import (
	"context"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/model"
)

func (c *commands) HelpCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*model.CommandResponse, error) {
	var cmdResp model.CommandResponse
	var commmandList []string

	commandListMap := c.GetSystemCommands()
	for k := range commandListMap {
		commmandList = append(commmandList, k)
	}

	commandListString := strings.Join(commmandList, ", ")

	cmdResp.Message = "Senchabot's Commands: " + commandListString
	return &cmdResp, nil
}

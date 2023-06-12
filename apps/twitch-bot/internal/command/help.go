package command

import (
	"context"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
)

func (c *commands) HelpCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) {
	commandListMap := c.GetCommands()
	var commmandList []string

	for k := range commandListMap {
		commmandList = append(commmandList, k)
	}

	commandListString := strings.Join(commmandList, ", ")

	c.client.Twitch.Say(message.Channel, "Senchabot's Commands: "+commandListString)
}

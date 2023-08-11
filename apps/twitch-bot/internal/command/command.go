package command

import (
	"context"
	"fmt"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/service"
)

type Command interface {
	RunCommand(context context.Context, cmdName string, params []string, message twitch.PrivateMessage)
	GetCommands() map[string]func(context context.Context, message twitch.PrivateMessage, commandName string, params []string)
}

type commands struct {
	client  *client.Clients
	service service.Service
}

func NewCommands(client *client.Clients, service service.Service) Command {
	return &commands{
		client:  client,
		service: service,
	}
}

func (c *commands) GetCommands() map[string]func(context context.Context, message twitch.PrivateMessage, commandName string, params []string) {
	// TODO: command aliases
	var commands = map[string]func(context context.Context, message twitch.PrivateMessage, commandName string, params []string){
		"ping":   c.PingCommand,
		"invite": c.InviteCommand,
		"sozluk": c.SozlukCommand,

		"acmd": c.AddCommandCommand,
		"ucmd": c.UpdateCommandCommand,
		"dcmd": c.DeleteCommandCommand,
		"cmds": c.CmdsCommand,

		"acmda": c.AddCommandAliasCommand,
		"dcmda": c.DeleteCommandAliasCommand,

		"help": c.HelpCommand,

		"astra":     c.AstraCommand,
		"kampus":    c.KampusCommand,
		"senchabot": c.SenchabotCommand,
	}

	return commands
}

func (c *commands) IsSystemCommand(commandName string) bool {
	commandListMap := c.GetCommands()
	for k := range commandListMap {
		if k == commandName {
			return true
		}
	}

	return false
}

func (c *commands) RunCommand(context context.Context, cmdName string, params []string, message twitch.PrivateMessage) {
	// HANDLE COMMAND ALIASES
	commandAlias, cmdAliasErr := c.service.GetCommandAlias(context, cmdName, message.RoomID)
	if cmdAliasErr != nil {
		fmt.Println(cmdAliasErr.Error())
	}

	if commandAlias != nil {
		cmdName = *commandAlias
	}
	// HANDLE COMMAND ALIASES

	// SYSTEM COMMANDS
	cmds := c.GetCommands()
	if cmd, ok := cmds[cmdName]; ok {
		cmd(context, message, cmdName, params)
		c.service.SaveBotCommandActivity(context, cmdName+" "+strings.Join(params, " "), message.RoomID, message.User.DisplayName, message.User.ID)
		return
	}
	// SYSTEM COMMANDS

	// GLOBAL COMMANDS
	cmdData, err := c.service.GetGlobalBotCommand(context, cmdName)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	if cmdData != nil || cmdData.Status == 1 {
		formattedCommandContent := helpers.FormatCommandContent(cmdData, message)
		c.client.Twitch.Say(message.Channel, formattedCommandContent)
		c.service.SaveBotCommandActivity(context, cmdName, message.RoomID, message.User.DisplayName, message.User.ID)
		return
	}
	// GLOBAL COMMANDS

	// USER COMMANDS
	cmdData, err = c.service.GetUserBotCommand(context, cmdName, message.RoomID)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	if cmdData == nil || message.RoomID != cmdData.TwitchChannelID && cmdData.Status == 0 {
		return
	}
	formattedCommandContent := helpers.FormatCommandContent(cmdData, message)
	c.client.Twitch.Say(message.Channel, formattedCommandContent)
	c.service.SaveBotCommandActivity(context, cmdName, message.RoomID, message.User.DisplayName, message.User.ID)
	// USER COMMANDS
}

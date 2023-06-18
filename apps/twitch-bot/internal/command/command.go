package command

import (
	"context"
	"fmt"
	"time"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/service"
)

type Command interface {
	RunStaticCommand(context context.Context, cmdName string, params []string, message twitch.PrivateMessage)
	RunDynamicCommand(context context.Context, cmdName string, message twitch.PrivateMessage)
	GetCommands() map[string]func(context context.Context, message twitch.PrivateMessage, commandName string, params []string)
}

type commands struct {
	client           *client.Clients
	service          service.Service
	commandCooldowns map[string]time.Time
	cooldownPeriod   time.Duration
}

func NewCommands(client *client.Clients, service service.Service, cooldownPeriod time.Duration) Command {
	return &commands{
		client:           client,
		service:          service,
		commandCooldowns: make(map[string]time.Time),
		cooldownPeriod:   cooldownPeriod,
	}
}

func (c *commands) GetCommands() map[string]func(context context.Context, message twitch.PrivateMessage, commandName string, params []string) {
	// TODO: command aliases
	var commands = map[string]func(context context.Context, message twitch.PrivateMessage, commandName string, params []string){
		"ping":      c.PingCommand,
		"invite":    c.InviteCommand,
		"senchabot": c.SenchabotCommand,
		"sukru":     c.SukruCommand,

		"acmd": c.AddCommandCommand,
		"ucmd": c.UpdateCommandCommand,
		"dcmd": c.DeleteCommandCommand,
		//"info": InfoCommandCommand,
		"cmds": c.CmdsCommand,

		"acmda": c.AddCommandAliasCommand,
		"dcmda": c.DeleteCommandAliasCommand,
		"help":  c.HelpCommand,

		"kampus":       c.KampusCommand,
		"frontendship": c.FrontendshipCommand,
	}

	return commands
}

func (c *commands) RunStaticCommand(context context.Context, cmdName string, params []string, message twitch.PrivateMessage) {
	cmds := c.GetCommands()

	if cmd, ok := cmds[cmdName]; ok {
		if c.isCommandOnCooldown(cmdName) {
			c.client.Twitch.Say(message.Channel, message.User.DisplayName+", the command \""+cmdName+"\" is on cooldown.")
			return
		}
		cmd(context, message, cmdName, params)
		c.setCommandCooldown(cmdName)
		c.service.SaveBotCommandActivity(context, cmdName, message.RoomID, message.User.DisplayName)
	}
}

func (c *commands) RunDynamicCommand(context context.Context, cmdName string, message twitch.PrivateMessage) {
	// HANDLE CUSTOM COMMANDS

	// HANDLE COMMAND ALIASES
	commandAlias, cmdAliasErr := c.service.GetCommandAlias(context, cmdName, message.RoomID)
	if cmdAliasErr != nil {
		fmt.Println(cmdAliasErr.Error())
	}

	if commandAlias != nil {
		cmdName = *commandAlias
	}
	// HANDLE COMMAND ALIASES

	cmdData, err := c.service.GetBotCommand(context, cmdName, message.RoomID)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	if cmdData == nil || message.RoomID != cmdData.TwitchChannelID {
		return
	}

	if c.isCommandOnCooldown(cmdName) {
		c.client.Twitch.Say(message.Channel, message.User.DisplayName+", the command \""+cmdName+"\" is on cooldown.")
		return
	}

	formattedCommandContent := helpers.FormatCommandContent(cmdData, message)
	c.client.Twitch.Say(message.Channel, formattedCommandContent)
	c.setCommandCooldown(cmdName)
	c.service.SaveBotCommandActivity(context, cmdName, message.RoomID, message.User.DisplayName)
	// HANDLE CUSTOM COMMANDS
}

func (c *commands) isCommandOnCooldown(cmdName string) bool {
	cooldownTime, exists := c.commandCooldowns[cmdName]
	if !exists {
		return false
	}

	return time.Now().Before(cooldownTime.Add(c.cooldownPeriod))
}

func (c *commands) setCommandCooldown(cmdName string) {
	c.commandCooldowns[cmdName] = time.Now()
}

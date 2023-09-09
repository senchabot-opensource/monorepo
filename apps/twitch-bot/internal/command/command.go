package command

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

type CommandFunc func(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*models.CommandResponse, error)

type CommandMap map[string]CommandFunc

type Command interface {
	GetCommands() CommandMap
	Run(context context.Context, cmdName string, params []string, message twitch.PrivateMessage)
	Respond(ctx context.Context, message twitch.PrivateMessage, cmdName string, messageContent string)
}

type commands struct {
	client         *client.Clients
	service        service.Service
	userCooldowns  map[string]time.Time
	cooldownPeriod time.Duration
}

func New(client *client.Clients, service service.Service, cooldownPeriod time.Duration) Command {
	return &commands{
		client:         client,
		service:        service,
		userCooldowns:  make(map[string]time.Time),
		cooldownPeriod: cooldownPeriod,
	}
}

func (c *commands) GetCommands() CommandMap {
	var commands = CommandMap{
		"ping":   c.PingCommand,
		"invite": c.InviteCommand,
		"sozluk": c.SozlukCommand,
		"so":     c.SoCommand,

		"timer":  c.CommandTimerCommand,
		"atimer": c.AddTimerCommand,
		"utimer": c.UpdateTimerCommand,
		"dtimer": c.DeleteTimerCommand,

		"acmd": c.AddCommandCommand,
		"ucmd": c.UpdateCommandCommand,
		"dcmd": c.DeleteCommandCommand,
		"cmds": c.CmdsCommand,

		"acmda": c.AddCommandAliasCommand,
		"dcmda": c.DeleteCommandAliasCommand,

		"help": c.HelpCommand,
	}

	return commands
}

func (c *commands) IsSystemCommand(commandName string) bool {
	commandListMap := c.GetCommands()
	_, ok := commandListMap[commandName]
	return ok
}

func (c *commands) Respond(ctx context.Context, message twitch.PrivateMessage, cmdName string, messageContent string) {
	c.client.Twitch.Say(message.Channel, messageContent)
	c.setCommandCooldown(message.User.Name)
	c.service.SaveCommandActivity(ctx, cmdName, message.RoomID, message.User.DisplayName, message.User.ID)
}

func (c *commands) Run(context context.Context, cmdName string, params []string, message twitch.PrivateMessage) {
	if c.isUserOnCooldown(message.User.Name) {
		return
	}

	// HANDLE COMMAND ALIASES
	commandAlias, cmdAliasErr := c.service.GetCommandAlias(context, cmdName, message.RoomID)
	if cmdAliasErr != nil {
		fmt.Println("[COMMAND ALIAS ERROR]:", cmdAliasErr.Error())
	}

	if commandAlias != nil {
		cmdName = *commandAlias
	}
	// HANDLE COMMAND ALIASES

	// USER COMMANDS
	cmdData, err := c.service.GetUserBotCommand(context, cmdName, message.RoomID)
	if err != nil {
		fmt.Println("[USER COMMAND ERROR]:", err.Error())
	}
	if cmdData != nil {
		formattedCommandContent := helpers.FormatCommandContent(cmdData, message)
		c.Respond(context, message, cmdName, formattedCommandContent)
		return
	}
	// USER COMMANDS

	// SYSTEM COMMANDS
	cmds := c.GetCommands()
	if cmd, ok := cmds[cmdName]; ok {
		cmdResp, err := cmd(context, message, cmdName, params)
		if err != nil {
			fmt.Println("[SYSTEM COMMAND ERROR]:", err.Error())
			return
		}
		c.Respond(context, message, cmdName+" "+strings.Join(params, " "), cmdResp.Message)
		return
	}
	// SYSTEM COMMANDS

	// GLOBAL COMMANDS
	cmdData, err = c.service.GetGlobalBotCommand(context, cmdName)
	if err != nil {
		fmt.Println("[GLOBAL COMMAND ERROR]:", err.Error())
		return
	}
	if cmdData == nil {
		return
	}

	formattedCommandContent := helpers.FormatCommandContent(cmdData, message)
	c.Respond(context, message, cmdName, formattedCommandContent)
	// GLOBAL COMMANDS
}

func (c *commands) isUserOnCooldown(username string) bool {
	cooldownTime, exists := c.userCooldowns[username]
	if !exists {
		return false
	}

	return time.Now().Before(cooldownTime.Add(c.cooldownPeriod))
}

func (c *commands) setCommandCooldown(username string) {
	c.userCooldowns[username] = time.Now()
}

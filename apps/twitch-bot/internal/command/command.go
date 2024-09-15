package command

import (
	"context"
	"log"
	"strings"
	"time"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/helper"
	"github.com/senchabot-opensource/monorepo/model"
)

type CommandFunc func(context context.Context, message twitch.PrivateMessage, commandName string, params []string) (*model.CommandResponse, error)

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
		"leave":  c.LeaveCommand,
		"sozluk": c.SozlukCommand,
		"so":     c.SoCommand,

		"acmd": c.AddCommandCommand,
		"ucmd": c.UpdateCommandCommand,
		"dcmd": c.DeleteCommandCommand,
		"cmds": c.CmdsCommand,

		"acmda": c.AddCommandAliasCommand,
		"dcmda": c.DeleteCommandAliasCommand,

		"atimer": c.AddTimerCommand,
		"dtimer": c.DeleteTimerCommand,
		"timers": c.TimersCommand,

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
	c.service.AddBotCommandStatistic(ctx, cmdName)
	c.service.SaveCommandActivity(ctx, cmdName, message.RoomID, message.User.DisplayName, message.User.ID)
}

func (c *commands) Run(context context.Context, cmdName string, params []string, message twitch.PrivateMessage) {
	if c.isUserOnCooldown(message.User.Name) {
		return
	}

	// HANDLE COMMAND ALIASES
	commandAlias, cmdAliasErr := c.service.GetCommandAlias(context, cmdName, message.RoomID)
	if cmdAliasErr != nil {
		log.Println("[COMMAND ALIAS ERROR]:", cmdAliasErr.Error())
	}

	if commandAlias != nil {
		cmdName = *commandAlias
	}
	// HANDLE COMMAND ALIASES

	// USER COMMANDS
	cmdData, err := c.service.GetUserBotCommand(context, cmdName, message.RoomID)
	if err != nil {
		log.Println("[USER COMMAND ERROR]:", err.Error())
	}
	if cmdData != nil {
		cmdVar := helpers.GetCommandVariables(cmdData, message)
		formattedCommandContent := helper.FormatCommandContent(cmdVar)
		c.Respond(context, message, cmdName, formattedCommandContent)
		return
	}
	// USER COMMANDS

	// SYSTEM COMMANDS
	cmds := c.GetCommands()
	if cmd, ok := cmds[cmdName]; ok {
		cmdResp, err := cmd(context, message, cmdName, params)
		if err != nil {
			log.Println("[SYSTEM COMMAND ERROR]:", err.Error())
			return
		}
		if cmdResp != nil {
			c.Respond(context, message, cmdName+" "+strings.Join(params, " "), cmdResp.Message)
		}
		return
	}
	// SYSTEM COMMANDS

	// GLOBAL COMMANDS
	cmdData, err = c.service.GetGlobalBotCommand(context, cmdName)
	if err != nil {
		log.Println("[GLOBAL COMMAND ERROR]:", err.Error())
		return
	}
	if cmdData == nil {
		return
	}

	cmdVar := helpers.GetCommandVariables(cmdData, message)
	formattedCommandContent := helper.FormatCommandContent(cmdVar)
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

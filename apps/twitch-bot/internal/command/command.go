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
	"github.com/senchabot-opensource/monorepo/pkg/twitchapi"
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
	twitchService  twitchapi.TwitchService
	userCooldowns  map[string]time.Time
	cooldownPeriod time.Duration
}

func New(client *client.Clients, service service.Service, twitchService twitchapi.TwitchService) Command {
	return &commands{
		client:         client,
		service:        service,
		twitchService:  twitchService,
		userCooldowns:  make(map[string]time.Time),
		cooldownPeriod: time.Second,
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
		"timer":  c.TimerCommand,

		// REFACTOR THESE COMMANDS'	NAMES
		"addcm":     c.AddChannelToTwitchCommunityCommand,
		"delcm":     c.RemoveCommunityMemberCommand,
		"subc":      c.SubscribeToCommunityCommand,
		"unsubc":    c.UnsubscribeFromCommunityCommand,
		"rr":        c.RrCommand,
		"unrr":      c.UnraidCommand, // add predefined aliases to this command: !unraid, !cancelraid
		"subcmlist": c.ListSubscribedCommunitiesCommand,
		"cmmlist":   c.CommunityMembersCommand,

		//"addcm": c.AddCommunityCommand,
		//"dcm":   c.DeleteCommunityCommand,
		//"cm":    c.CommunitiesCommand,

		//"addcmm": c.AddCommunityMemberCommand,
		//"dcmm":   c.DeleteCommunityMemberCommand,
		//"cmm":    c.CommunityMembersCommand,

		"acmdvar": c.AddCommandVariableCommand,
		"ucmdvar": c.UpdateCommandVariableCommand,
		"dcmdvar": c.DeleteCommandVariableCommand,
		"lcmdvar": c.ListCommandVariablesCommand,

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

func (c *commands) runCustomCommand(ctx context.Context, cmdName string, privMsg twitch.PrivateMessage) {
	cmdData, err := c.service.GetUserBotCommand(ctx, cmdName, privMsg.RoomID)
	if err != nil {
		log.Println("[runCustomCommand] USER BOT COMMAND ERROR:", err.Error())
	}
	if cmdData != nil {
		cmdVar := helpers.GetCommandVariables(cmdData, privMsg)
		formattedCommandContent := helper.FormatCommandContent(cmdVar, c.service)
		c.Respond(ctx, privMsg, cmdName, formattedCommandContent)
		return
	}
}

func (c *commands) runSystemCommand(ctx context.Context, cmdName string, params []string, privMsg twitch.PrivateMessage) {

	cmds := c.GetCommands()
	if cmd, ok := cmds[cmdName]; ok {
		cmdResp, err := cmd(ctx, privMsg, cmdName, params)
		if err != nil {
			log.Println("[runSystemCommand] SYSTEM COMMAND ERROR:", err.Error())
			return
		}
		if cmdResp != nil {
			c.Respond(ctx, privMsg, cmdName+" "+strings.Join(params, " "), cmdResp.Message)
		}
		return
	}
}

func (c *commands) Run(ctx context.Context, cmdName string, params []string, privMsg twitch.PrivateMessage) {
	if c.isUserOnCooldown(privMsg.User.Name) {
		return
	}

	// HANDLE COMMAND ALIASES
	commandAlias, cmdAliasErr := c.service.GetCommandAlias(ctx, cmdName, privMsg.RoomID)
	if cmdAliasErr != nil {
		log.Println("[command.Run] COMMAND ALIAS ERROR:", cmdAliasErr.Error())
	}

	if commandAlias != nil {
		cmdName = *commandAlias
	}
	// HANDLE COMMAND ALIASES

	// USER COMMANDS
	c.runCustomCommand(ctx, cmdName, privMsg)
	// USER COMMANDS

	// SYSTEM COMMANDS
	c.runSystemCommand(ctx, cmdName, params, privMsg)
	// SYSTEM COMMANDS

	// GLOBAL COMMANDS
	// lower case sensitive ?
	cmdName = strings.ToLower(cmdName)
	cmdData, err := c.service.GetGlobalBotCommand(ctx, cmdName)
	if err != nil {
		log.Println("[command.Run] GLOBAL COMMAND ERROR:", err.Error())
		return
	}
	if cmdData == nil {
		return
	}

	cmdVar := helpers.GetCommandVariables(cmdData, privMsg)
	formattedCommandContent := helper.FormatCommandContent(cmdVar, c.service)
	c.Respond(ctx, privMsg, cmdName, formattedCommandContent)
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

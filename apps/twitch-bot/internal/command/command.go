package command

import (
	"context"
	"fmt"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/service"
)

type Command interface {
	RunCommand(context context.Context, cmdName string, message twitch.PrivateMessage)
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

func (s *commands) GetCommands() map[string]func(context context.Context, message twitch.PrivateMessage, commandName string, params []string) {
	// TODO: command aliases
	var commands = map[string]func(context context.Context, message twitch.PrivateMessage, commandName string, params []string){
		"ping":      s.PingCommand,
		"invite":    s.InviteCommand,
		"senchabot": s.SenchabotCommand,
		"sukru":     s.SukruCommand,

		"acmd": s.AddCommandCommand,
		"ucmd": s.UpdateCommandCommand,
		"dcmd": s.DeleteCommandCommand,
		//"info": InfoCommandCommand,
		"cmds": s.CmdsCommand,

		"acmda": s.AddCommandAliasCommand,
		"dcmda": s.DeleteCommandAliasCommand,
		"help":  s.HelpCommand,

		"kampus":       s.KampusCommand,
		"frontendship": s.FrontendshipCommand,
	}

	return commands
}

func (s *commands) RunCommand(context context.Context, cmdName string, message twitch.PrivateMessage) {
	// HANDLE CUSTOM COMMANDS

	// HANDLE COMMAND ALIASES
	commandAlias, cmdAliasErr := s.service.GetCommandAlias(context, cmdName, message.RoomID)
	if cmdAliasErr != nil {
		fmt.Println(cmdAliasErr.Error())
	}

	if commandAlias != nil {
		cmdName = *commandAlias
	}
	// HANDLE COMMAND ALIASES

	cmdData, err := s.service.GetBotCommand(context, cmdName, message.RoomID)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	if cmdData == nil || message.RoomID != cmdData.TwitchChannelID {
		return
	}

	formattedCommandContent := helpers.FormatCommandContent(cmdData, message)
	s.client.Twitch.Say(message.Channel, formattedCommandContent)
	s.service.SaveBotCommandActivity(context, cmdName, message.RoomID, message.User.DisplayName)
	// HANDLE CUSTOM COMMANDS
}

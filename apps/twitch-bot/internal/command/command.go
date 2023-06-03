package command

import (
	"context"
	"fmt"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/command/helpers"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/service"
)

type Command interface {
	RunCommand(context context.Context, message twitch.PrivateMessage)
}

type commands struct {
	client  *client.Clients
	service *service.Services
}

func NewCommands(client *client.Clients, service *service.Services) Command {
	return &commands{
		client:  client,
		service: service,
	}
}

func (s *commands) GetCommands() map[string]func(message twitch.PrivateMessage, commandName string, params []string) {
	// TODO: command aliases
	var commands = map[string]func(message twitch.PrivateMessage, commandName string, params []string){
		"ping":      s.PingCommand,
		"invite":    s.InviteCommand,
		"senchabot": s.SenchabotCommand,
		"sukru":     s.SukruCommand,

		"acmd": s.AddCommandCommand,
		"ucmd": s.UpdateCommandCommand,
		"dcmd": s.DeleteCommandCommand,
		//"info": InfoCommandCommand,
		//"cmds": CmdsCommandCommand,

		"acmda": s.AddCommandAliasCommand,
		"dcmda": s.DeleteCommandAliasCommand,

		"kampus":       s.KampusCommand,
		"frontendship": s.FrontendshipCommand,
	}

	return commands
}

func splitMessage(message string) (string, []string) {
	var splitMsg = strings.Split(message, " ")
	var cmdName = strings.Trim(splitMsg[0], " ")
	var params = splitMsg[1:]

	if !strings.HasPrefix(cmdName, "!") {
		return "", nil
	}

	cmdName = strings.TrimPrefix(cmdName, "!")

	return cmdName, params
}

func (s *commands) RunCommand(context context.Context, message twitch.PrivateMessage) {
	commands := s.GetCommands()

	cmdName, params := splitMessage(message.Message)
	if cmdName == "" {
		return
	}

	if cmd, ok := commands[cmdName]; ok {
		cmd(message, cmdName, params)
		s.service.DB.SaveBotCommandActivity(context, cmdName, message.RoomID, message.User.DisplayName)
		return
	}

	// HANDLE CUSTOM COMMANDS

	// HANDLE COMMAND ALIASES
	commandAlias, cmdAliasErr := s.service.DB.GetCommandAlias(context, cmdName, message.RoomID)
	if cmdAliasErr != nil {
		fmt.Println(cmdAliasErr.Error())
	}

	if commandAlias != nil {
		cmdName = *commandAlias
	}
	// HANDLE COMMAND ALIASES

	cmdData, err := s.service.DB.GetBotCommand(context, cmdName, message.RoomID)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	if cmdData == nil || message.RoomID != cmdData.TwitchChannelID {
		return
	}

	formattedCommandContent := helpers.FormatCommandContent(cmdData, message)
	s.client.Twitch.Say(message.Channel, formattedCommandContent)
	s.service.DB.SaveBotCommandActivity(context, cmdName, message.RoomID, message.User.DisplayName)
	// HANDLE CUSTOM COMMANDS
}

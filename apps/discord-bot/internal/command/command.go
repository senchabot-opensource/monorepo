package command

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/command/helpers"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service/streamer"
	"github.com/senchabot-opensource/monorepo/helper"
	"github.com/senchabot-opensource/monorepo/model"
	"github.com/senchabot-opensource/monorepo/pkg/twitchapi"
)

type CommandFunc func(context context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, service service.Service)

type CommandMap map[string]CommandFunc

type SysCommandFunc func(context context.Context, m *discordgo.MessageCreate, commandName string, params []string) (*model.CommandResponse, error)

type SysCommandMap map[string]SysCommandFunc

type Command interface {
	GetCommands() CommandMap // GetCustomCommands
	GetSystemCommands() SysCommandMap
	Run(context context.Context, cmdName string, params []string, m *discordgo.MessageCreate)
	Respond(ctx context.Context, m *discordgo.MessageCreate, cmdName string, messageContent string)
}

type commands struct {
	dS             *discordgo.Session
	service        service.Service
	twitchService  twitchapi.TwitchService
	streamerSvc    *streamer.StreamerService
	userCooldowns  map[string]time.Time
	cooldownPeriod time.Duration
}

func New(discordClient *discordgo.Session, service service.Service, twitchService twitchapi.TwitchService) *commands {
	deployCommands(discordClient)

	return &commands{
		dS:             discordClient,
		service:        service,
		twitchService:  twitchService,
		streamerSvc:    streamer.NewStreamerService(twitchService),
		userCooldowns:  make(map[string]time.Time),
		cooldownPeriod: time.Second,
	}

	// // time.Duration(os.Getenv("COOLDOWN_PERIOD")) * time.Second
}

func (c *commands) GetCommands() CommandMap {
	var commands = CommandMap{
		"set-twitch":    c.SetTwitchCommand,
		"del-twitch":    c.DelTwitchCommand,
		"streamer-list": c.StreamerListCommand,
		"purge":         c.PurgeCommand,
		"invite":        c.InviteCommand,
	}

	return commands
}

// SYSTEM COMMANDS

func (c *commands) GetSystemCommands() SysCommandMap {
	var commands = SysCommandMap{
		"cmds":   c.CmdsCommand,
		"acmd":   c.AddCommandCommand,
		"ucmd":   c.UpdateCommandCommand,
		"dcmd":   c.DeleteCommandCommand,
		"acmda":  c.AddCommandAliasCommand,
		"dcmda":  c.DeleteCommandAliasCommand,
		"sozluk": c.SozlukCommand,

		"acmdvar": c.AddCommandVariableCommand,
		"ucmdvar": c.UpdateCommandVariableCommand,
		"dcmdvar": c.DeleteCommandVariableCommand,
		"lcmdvar": c.ListCommandVariablesCommand,
	}

	return commands
}

// SYSTEM COMMANDS

func (c *commands) IsSystemCommand(commandName string) bool {
	sysCommandListMap := c.GetSystemCommands()
	commandListMap := c.GetCommands()

	_, ok := sysCommandListMap[commandName]
	if ok {
		return ok
	}

	_, ok = commandListMap[commandName]
	return ok
}

func (c *commands) Respond(ctx context.Context, m *discordgo.MessageCreate, cmdName string, messageContent string) {
	c.dS.ChannelMessageSend(m.ChannelID, messageContent)
	c.setCommandCooldown(m.Author.Username)
	c.service.AddBotCommandStatistic(ctx, cmdName)
	c.service.SaveCommandActivity(ctx, cmdName, m.GuildID, m.Author.Username, m.Author.ID)
}

func (c *commands) runCustomCommand(ctx context.Context, cmdName string, mC *discordgo.MessageCreate) {
	cmdData, err := c.service.GetUserBotCommand(ctx, cmdName, mC.GuildID)
	if err != nil {
		log.Println("[runCustomCommand] USER BOT COMMAND ERROR:", err.Error())
	}
	if cmdData != nil {
		cmdVar := helpers.GetCommandVariables(c.dS, cmdData, mC)
		formattedCommandContent := helper.FormatCommandContent(cmdVar, c.service)
		c.Respond(ctx, mC, cmdName, formattedCommandContent)
		return
	}
}

func (c *commands) runSystemCommand(ctx context.Context, cmdName string, params []string, m *discordgo.MessageCreate) {
	cmds := c.GetSystemCommands()
	if cmd, ok := cmds[cmdName]; ok {
		cmdResp, err := cmd(ctx, m, cmdName, params)
		if err != nil {
			log.Println("[runSystemCommand] SYSTEM COMMAND ERROR:", err.Error())
			return
		}
		c.Respond(ctx, m, cmdName+" "+strings.Join(params, " "), cmdResp.Message)
		return
	}
}

func (c *commands) Run(ctx context.Context, cmdName string, params []string, m *discordgo.MessageCreate) {
	if c.isUserOnCooldown(m.Author.Username) {
		return
	}

	// HANDLE COMMAND ALIASES
	commandAlias, cmdAliasErr := c.service.GetCommandAlias(ctx, cmdName, m.GuildID)
	if cmdAliasErr != nil {
		log.Println("[command.Run] COMMAND ALIAS ERROR:", cmdAliasErr.Error())
	}

	if commandAlias != nil {
		cmdName = *commandAlias
	}
	// HANDLE COMMAND ALIASES

	// USER COMMANDS
	c.runCustomCommand(ctx, cmdName, m)
	// USER COMMANDS

	// SYSTEM COMMMANDS
	c.runSystemCommand(ctx, cmdName, params, m)
	// SYSTEM COMMANDS

	// GLOBAL COMMANDS
	cmdData, err := c.service.GetGlobalBotCommand(ctx, cmdName)
	if err != nil {
		log.Println("[command.Run] GLOBAL COMMAND ERROR:", err.Error())
		return
	}
	if cmdData == nil {
		return
	}

	cmdVar := helpers.GetCommandVariables(c.dS, cmdData, m)
	formattedCommandContent := helper.FormatCommandContent(cmdVar, c.service)
	c.Respond(ctx, m, cmdName, formattedCommandContent)
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

func deployCommands(discordClient *discordgo.Session) {
	log.Println("[deployCommands] Deploying slash commands...")
	registeredCommands := make([]*discordgo.ApplicationCommand, len(commandMetadatas))
	for i, v := range commandMetadatas {
		cmd, err := discordClient.ApplicationCommandCreate(os.Getenv("CLIENT_ID"), "", v)
		if err != nil {
			options := []string{}
			for _, vi := range v.Options {
				options = append(options, vi.Name)
				if len(vi.Options) > 0 {
					for _, vj := range vi.Options {
						options = append(options, fmt.Sprintf(`"%v: %v, %v"`, vj.Name, len(vj.Description), vj.DescriptionLocalizations))
					}
				}
			}
			log.Printf("[deployCommands] Slash command '%v' cannot created. Command's options: '%v'\nError: '%v'\n", v.Name, strings.Join(options, " "), err)
		}
		registeredCommands[i] = cmd
	}
}

var (
	purgePermissions     int64 = discordgo.PermissionManageServer
	setdeletePermissions int64 = discordgo.PermissionManageServer
	//manageCmdPermissions int64 = discordgo.PermissionManageChannels
	commandMetadatas = []*discordgo.ApplicationCommand{
		// SET-TWITCH
		SetTwitchCommandMetadata(),
		// DEL-TWITCH
		DelTwitchCommandMetadata(),
		// STREAMER-LIST
		StreamerListCommandMetadata(),
		// PURGE
		PurgeCommandMetadata(),
		// INVITE
		InviteCommandMetadata(),
	}
)

func ephemeralRespond(s *discordgo.Session, i *discordgo.InteractionCreate, msgContent string) {
	s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionResponseData{
			Content: msgContent,
			Flags:   discordgo.MessageFlagsEphemeral,
		},
	})
}

package command

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service/streamer"
	"github.com/senchabot-opensource/monorepo/pkg/twitchapi"
)

type SysCommandFunc func(context context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, service service.Service)

type SysCommandMap map[string]SysCommandFunc

type Command interface {
	GetSystemCommands() SysCommandMap
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

// SYSTEM COMMANDS
func (c *commands) GetSystemCommands() SysCommandMap {
	var commands = SysCommandMap{
		"set-twitch":               c.SetTwitchCommand,
		"del-twitch":               c.DelTwitchCommand,
		"streamer-list":            c.StreamerListCommand,
		"purge":                    c.PurgeCommand,
		"invite":                   c.InviteCommand,
		"do-not-track-my-messages": c.DoNotTrackMessagesCommand,
		"track-my-messages":        c.TrackMyMessagesCommand,
		"cmds":                     c.CmdsCommandHandler,
		"acmd":                     c.AcmdCommandHandler,
		"ucmd":                     c.UcmdCommandHandler,
		"dcmd":                     c.DcmdCommandHandler,
		"sozluk":                   c.SozlukCommandHandler,

		"acmdvar": c.AcmdvarCommandHandler,
		"ucmdvar": c.UcmdvarCommandHandler,
		"dcmdvar": c.DcmdvarCommandHandler,
		"lcmdvar": c.LcmdvarCommandHandler,
	}

	return commands
}

// SYSTEM COMMANDS

func (c *commands) IsSystemCommand(commandName string) bool {
	sysCommandListMap := c.GetSystemCommands()

	_, ok := sysCommandListMap[commandName]
	return ok
}

func (c *commands) isUserOnCooldown(username string) bool {
	cooldownTime, exists := c.userCooldowns[username]
	if !exists {
		return false
	}

	return time.Now().Before(cooldownTime.Add(c.cooldownPeriod))
}

func (c *commands) setCommandCooldown(username string) { // TODO: userId
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

	log.Println("[deployCommands] Finished deploying slash commands")
}

var (
	purgePermissions     int64 = discordgo.PermissionManageServer
	setdeletePermissions int64 = discordgo.PermissionManageServer
	dmPermission               = false
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
		// DO-NOT-TRACK-MY-MESSAGES
		DoNotTrackMessagesCommandMetadata(),
		// TRACK-MY-MESSAGES
		TrackMyMessagesCommandMetadata(),
		// MANAGE COMMANDS
		AcmdCommandMetadata(),
		UcmdCommandMetadata(),
		DcmdCommandMetadata(),
		CmdsCommandMetadata(),
		SozlukCommandMetadata(),

		AcmdvarCommandMetadata(),
		UcmdvarCommandMetadata(),
		DcmdvarCommandMetadata(),
		LcmdvarCommandMetadata(),
	}
)

// CreateCustomCommandSlashCommand creates a slash command for a custom command
func CreateCustomCommandSlashCommand(name string, description string) *discordgo.ApplicationCommand {
	return &discordgo.ApplicationCommand{
		Name:        name,
		Description: description,
	}
}

// DeployCustomCommandsForGuild deploys all custom commands for a guild as slash commands
func DeployCustomCommandsForGuild(s *discordgo.Session, ctx context.Context, service service.Service, guildID string) {
	// Get all custom commands for this guild
	commands, err := service.GetCommandList(ctx, guildID)
	if err != nil {
		log.Printf("[DeployCustomCommandsForGuild] Error getting custom commands for guild %s: %v\n", guildID, err)
		return
	}

	log.Printf("[DeployCustomCommandsForGuild] Deploying %d custom commands for guild %s\n", len(commands), guildID)

	// Create slash commands for each custom command
	for _, cmd := range commands {
		description := "Custom command"

		slashCmd := CreateCustomCommandSlashCommand(cmd.CommandName, description)
		_, err := s.ApplicationCommandCreate(os.Getenv("CLIENT_ID"), guildID, slashCmd)
		if err != nil {
			log.Printf("[DeployCustomCommandsForGuild] Failed to create slash command '%s' for guild %s: %v\n",
				cmd.CommandName, guildID, err)
			continue
		}
	}
}

func ephemeralRespond(s *discordgo.Session, i *discordgo.InteractionCreate, msgContent string) {
	s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionResponseData{
			Content: msgContent,
			Flags:   discordgo.MessageFlagsEphemeral,
		},
	})
}

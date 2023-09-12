package command

import (
	"context"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
)

type CommandFunc func(context context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, service service.Service)

type CommandMap map[string]CommandFunc

type Command interface {
	GetCommands() CommandMap
	Run(context context.Context, cmdName string, params []string, m *discordgo.MessageCreate)
	Respond(ctx context.Context, m *discordgo.MessageCreate, cmdName string, messageContent string)
	DeployCommands(discordClient *discordgo.Session)
}

type commands struct {
	twitchAccessToken string
	dS                *discordgo.Session
	service           service.Service
	userCooldowns     map[string]time.Time
	cooldownPeriod    time.Duration
}

func New(dS *discordgo.Session, token string, service service.Service, cooldownPeriod time.Duration) Command {
	return &commands{
		twitchAccessToken: token,
		dS:                dS,
		service:           service,
		userCooldowns:     make(map[string]time.Time),
		cooldownPeriod:    cooldownPeriod,
	}
}

func (c *commands) GetCommands() CommandMap {
	var commands = CommandMap{
		"cmds":   c.CmdsCommand,
		"acmd":   c.AddCommandCommand,
		"ucmd":   c.UpdateCommandCommand,
		"dcmd":   c.DeleteCommandCommand,
		"acmda":  c.AddCommandAliasCommand,
		"dcmda":  c.DeleteCommandAliasCommand,
		"set":    c.SetCommand,
		"delete": c.DeleteCommand,
		"purge":  c.PurgeCommand,
		"invite": c.InviteCommand,
	}

	return commands
}

func (c *commands) IsSystemCommand(commandName string) bool {
	commandListMap := c.GetCommands()
	_, ok := commandListMap[commandName]
	return ok
}

func (c *commands) Respond(ctx context.Context, m *discordgo.MessageCreate, cmdName string, messageContent string) {
	c.dS.ChannelMessageSend(m.ChannelID, messageContent)
	c.setCommandCooldown(m.Author.Username)
	c.service.AddBotCommandStatistic(ctx, cmdName)
	c.service.SaveCommandActivity(ctx, cmdName, m.GuildID, m.Author.Username, m.Author.ID)
}

func (c *commands) Run(ctx context.Context, cmdName string, params []string, m *discordgo.MessageCreate) {
	if c.isUserOnCooldown(m.Author.Username) {
		return
	}

	// HANDLE COMMAND ALIASES
	commandAlias, cmdAliasErr := c.service.GetCommandAlias(ctx, cmdName, m.GuildID)
	if cmdAliasErr != nil {
		fmt.Println("[COMMAND ALIAS ERROR]:", cmdAliasErr.Error())
	}

	if commandAlias != nil {
		cmdName = *commandAlias
	}
	// HANDLE COMMAND ALIASES

	// USER COMMANDS
	cmdData, err := c.service.GetUserBotCommand(ctx, cmdName, m.GuildID)
	if err != nil {
		fmt.Println("[USER COMMAND ERROR]:", err.Error())
	}
	if cmdData != nil {
		//formattedCommandContent := helpers.FormatCommandContent(cmdData, m)
		c.Respond(ctx, m, cmdName, cmdData.CommandContent)
		return
	}
	// USER COMMANDS

	// GLOBAL COMMANDS
	cmdData, err = c.service.GetGlobalBotCommand(ctx, cmdName)
	if err != nil {
		fmt.Println("[GLOBAL COMMAND ERROR]:", err.Error())
		return
	}
	if cmdData == nil {
		return
	}

	//formattedCommandContent := helpers.FormatCommandContent(cmdData, m)
	c.Respond(ctx, m, cmdName, cmdData.CommandContent)
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

func (c *commands) DeployCommands(discordClient *discordgo.Session) {
	fmt.Println("DEPLOYING SLASH COMMANDS...")
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
			fmt.Printf("Slash command '%v' cannot created. Command's options: '%v'\nError: '%v'\n", v.Name, strings.Join(options, " "), err)
		}
		registeredCommands[i] = cmd
	}
}

var (
	purgePermissions     int64 = discordgo.PermissionManageServer
	setdeletePermissions int64 = discordgo.PermissionAdministrator
	manageCmdPermissions int64 = discordgo.PermissionManageChannels
	commandMetadatas           = []*discordgo.ApplicationCommand{
		{
			Name:        "cmds",
			Description: "Command list.",
		},
		{
			Name:                     "acmd",
			Description:              "Add a new custom command.",
			DefaultMemberPermissions: &manageCmdPermissions,
			Options: []*discordgo.ApplicationCommandOption{
				{
					Type:        discordgo.ApplicationCommandOptionString,
					Name:        "command-name",
					Description: "Command Name",
					Required:    true,
				},
				{
					Type:        discordgo.ApplicationCommandOptionString,
					Name:        "command-content",
					Description: "Command Content",
					Required:    true,
				},
			},
		},
		{
			Name:                     "ucmd",
			Description:              "Update a custom command.",
			DefaultMemberPermissions: &manageCmdPermissions,
			Options: []*discordgo.ApplicationCommandOption{
				{
					Type:        discordgo.ApplicationCommandOptionString,
					Name:        "command-name",
					Description: "Command Name",
					Required:    true,
				},
				{
					Type:        discordgo.ApplicationCommandOptionString,
					Name:        "command-content",
					Description: "New Command Content",
					Required:    true,
				},
			},
		},
		{
			Name:                     "dcmd",
			Description:              "Delete a custom command.",
			DefaultMemberPermissions: &manageCmdPermissions,
			Options: []*discordgo.ApplicationCommandOption{
				{
					Type:        discordgo.ApplicationCommandOptionString,
					Name:        "command-name",
					Description: "Command Name",
					Required:    true,
				},
			},
		},
		{
			Name:                     "acmda",
			Description:              "Add command aliases to a command.",
			DefaultMemberPermissions: &manageCmdPermissions,
			Options: []*discordgo.ApplicationCommandOption{
				{
					Type:        discordgo.ApplicationCommandOptionString,
					Name:        "command-name",
					Description: "Command Name",
					Required:    true,
				},
				{
					Type:        discordgo.ApplicationCommandOptionString,
					Name:        "command-aliases",
					Description: "Command alias(es) separated by space",
					Required:    true,
				},
			},
		},
		{
			Name:                     "dcmda",
			Description:              "Delete a command alias.",
			DefaultMemberPermissions: &manageCmdPermissions,
			Options: []*discordgo.ApplicationCommandOption{
				{
					Type:        discordgo.ApplicationCommandOptionString,
					Name:        "command-alias",
					Description: "Command Alias",
					Required:    true,
				},
			},
		},
		{
			Name:        "set",
			Description: "Discord bot configuration",
			DescriptionLocalizations: &map[discordgo.Locale]string{
				discordgo.Turkish: "Discord botunu yapılandırma ayarları",
			},
			DefaultMemberPermissions: &setdeletePermissions,
			Options: []*discordgo.ApplicationCommandOption{
				{
					Name:        "stream-anno-default-channel",
					Description: "Set the default channel for live stream announcements.",
					DescriptionLocalizations: map[discordgo.Locale]string{
						discordgo.Turkish: "Yayın duyuru mesajlarının atılacağı varsayılan kanalı ayarla.",
					},
					Type: discordgo.ApplicationCommandOptionSubCommand,
					Options: []*discordgo.ApplicationCommandOption{
						{
							Type:        discordgo.ApplicationCommandOptionChannel,
							Name:        "channel-name",
							Description: "Text channel",
							DescriptionLocalizations: map[discordgo.Locale]string{
								discordgo.Turkish: "Yazı kanalı",
							},
							ChannelTypes: []discordgo.ChannelType{
								discordgo.ChannelTypeGuildNews,
								discordgo.ChannelTypeGuildText,
							},
							Required: true,
						},
					},
				},
				{
					Name:        "stream-anno-default-content",
					Description: "Default message content for live stream announcements.",
					DescriptionLocalizations: map[discordgo.Locale]string{
						discordgo.Turkish: "Varsayılan yayın duyuru mesajı ayarla.",
					},
					Type: discordgo.ApplicationCommandOptionSubCommand,
					Options: []*discordgo.ApplicationCommandOption{
						{
							Type:        discordgo.ApplicationCommandOptionString,
							Name:        "announcement-content",
							Description: "Stream announcement content ({twitch.username} {twitch.url} {stream.category} {stream.title})",
							DescriptionLocalizations: map[discordgo.Locale]string{
								discordgo.Turkish: "Yayın mesaj duyuru içeriği ({twitch.username} {twitch.url} {stream.category} {stream.title})",
							},
							Required: true,
						},
					},
				},
				{
					Name:        "stream-anno-custom-content",
					Description: "Streamer specific custom live stream announcement message content.",
					DescriptionLocalizations: map[discordgo.Locale]string{
						discordgo.Turkish: "Yayıncıya özgü yayın duyuru mesajı ayarla.",
					},
					Type: discordgo.ApplicationCommandOptionSubCommand,
					Options: []*discordgo.ApplicationCommandOption{
						{
							Type:        discordgo.ApplicationCommandOptionString,
							Name:        "twitch-username-or-url",
							Description: "Twitch profile url or username",
							DescriptionLocalizations: map[discordgo.Locale]string{
								discordgo.Turkish: "Twitch kullanıcı profil linki veya kullanıcı adı",
							},
							Required: true,
						},
						{
							Type:        discordgo.ApplicationCommandOptionString,
							Name:        "announcement-content",
							Description: "Stream announcement content ({twitch.username} {twitch.url} {stream.category} {stream.title})",
							DescriptionLocalizations: map[discordgo.Locale]string{
								discordgo.Turkish: "Yayın mesaj duyuru içeriği ({twitch.username} {twitch.url} {stream.category} {stream.title})",
							},
							Required: true,
						},
					},
				},
				{
					Name:        "streamer",
					Description: "Add a streamer for live stream announcements. You can specify custom channel.",
					DescriptionLocalizations: map[discordgo.Locale]string{
						discordgo.Turkish: "Yayın duyuru mesajı atılacak yayıncıyı ekle. Özel kanal atayabilirsin.",
					},
					Type: discordgo.ApplicationCommandOptionSubCommand,
					Options: []*discordgo.ApplicationCommandOption{
						{
							Type:        discordgo.ApplicationCommandOptionString,
							Name:        "twitch-username-or-url",
							Description: "Twitch profile url or username",
							DescriptionLocalizations: map[discordgo.Locale]string{
								discordgo.Turkish: "Twitch kullanıcı profil linki veya kullanıcı adı",
							},
							Required: true,
						},
						{
							Type:        discordgo.ApplicationCommandOptionChannel,
							Name:        "channel-name",
							Description: "Text channel for live stream announcements",
							DescriptionLocalizations: map[discordgo.Locale]string{
								discordgo.Turkish: "Duyuruların yapılacağı yazı kanalı adı",
							},
							ChannelTypes: []discordgo.ChannelType{
								discordgo.ChannelTypeGuildNews,
								discordgo.ChannelTypeGuildText,
							},
							Required: false,
						},
					},
				},
				{
					Name:        "stream-event-channel",
					Description: "Select the live stream announcements channel to create Discord events for live streams.",
					DescriptionLocalizations: map[discordgo.Locale]string{
						discordgo.Turkish: "Canlı yayınların Discord etkinliklerini oluşturmak için canlı yayın duyuruları kanalını seç.",
					},
					Type: discordgo.ApplicationCommandOptionSubCommand,
					Options: []*discordgo.ApplicationCommandOption{
						{
							Type:        discordgo.ApplicationCommandOptionChannel,
							Name:        "channel-name",
							Description: "Text channel to follow Twitch live stream announcements",
							DescriptionLocalizations: map[discordgo.Locale]string{
								discordgo.Turkish: "Twitch yayın duyurularının takip edileceği yazı kanalı",
							},
							ChannelTypes: []discordgo.ChannelType{
								discordgo.ChannelTypeGuildNews,
								discordgo.ChannelTypeGuildText,
							},
							Required: true,
						},
					},
				},
			},
		},
		{
			Name:        "purge",
			Description: "Purge commands",
			DescriptionLocalizations: &map[discordgo.Locale]string{
				discordgo.Turkish: "Temizleme komutları",
			},
			DefaultMemberPermissions: &purgePermissions,
			Options: []*discordgo.ApplicationCommandOption{
				{
					Name:        "events",
					Description: "Cancel all scheduled events.",
					DescriptionLocalizations: map[discordgo.Locale]string{
						discordgo.Turkish: "Tüm zamanlanmış etkinlikleri iptal et.",
					},
					Type: discordgo.ApplicationCommandOptionSubCommand,
				},
				{
					Name:        "last-100-channel-messages",
					Description: "Purge messages not older than 14 days containing certain characters or sent by centain username.",
					DescriptionLocalizations: map[discordgo.Locale]string{
						discordgo.Turkish: "14 günden eski olmayan mesajları kullanıcı adı veya mesaj iceriğindeki karakterlere göre siler.",
					},
					Type: discordgo.ApplicationCommandOptionSubCommand,
					Options: []*discordgo.ApplicationCommandOption{
						{
							Name:        "message-content-contains",
							Description: "certain characters that contain in messages",
							DescriptionLocalizations: map[discordgo.Locale]string{
								discordgo.Turkish: "silinecek mesajların içerdiği karakterler",
							},
							Type: discordgo.ApplicationCommandOptionString,
						},
						{
							Name:        "user-name-contains",
							Description: "certain characters that contain in user's name or nickname",
							DescriptionLocalizations: map[discordgo.Locale]string{
								discordgo.Turkish: "kullanıcı adı veya takma adının içerdiği karakterler",
							},
							Type: discordgo.ApplicationCommandOptionString,
						},
					},
				},
			},
		},
		{
			Name:        "delete",
			Description: "Delete configuration setting.",
			DescriptionLocalizations: &map[discordgo.Locale]string{
				discordgo.Turkish: "Yapılandırma ayarlarını kaldır.",
			},
			DefaultMemberPermissions: &setdeletePermissions,
			Options: []*discordgo.ApplicationCommandOption{
				{
					Name:        "stream-anno-default-channel",
					Description: "Delete the default channel configuration for live stream announcements.",
					DescriptionLocalizations: map[discordgo.Locale]string{
						discordgo.Turkish: "Yayın duyuru mesajlarının atılacağı varsayılan kanal ayarını kaldır.",
					},
					Type: discordgo.ApplicationCommandOptionSubCommand,
				},
				{
					Name:        "stream-anno-default-content",
					Description: "Delete the default announcement message content configuration.",
					DescriptionLocalizations: map[discordgo.Locale]string{
						discordgo.Turkish: "Varsayılan yayın duyuru mesajını sil.",
					},
					Type: discordgo.ApplicationCommandOptionSubCommand,
				},
				{
					Name:        "streamer",
					Description: "Delete the stream from live stream announcements.",
					DescriptionLocalizations: map[discordgo.Locale]string{
						discordgo.Turkish: "Yayın duyuru mesajı atılan yayıncıyı sil.",
					},
					Type: discordgo.ApplicationCommandOptionSubCommand,
					Options: []*discordgo.ApplicationCommandOption{
						{
							Type:        discordgo.ApplicationCommandOptionString,
							Name:        "twitch-username-or-url",
							Description: "Twitch profile url or username",
							DescriptionLocalizations: map[discordgo.Locale]string{
								discordgo.Turkish: "Twitch kullanıcı profil linki veya kullanıcı adı",
							},
							Required: true,
						},
					},
				},
				{
					Name:        "stream-anno-custom-content",
					Description: "Delete the streamer specific custom live stream announcement message content.",
					DescriptionLocalizations: map[discordgo.Locale]string{
						discordgo.Turkish: "Yayıncıya özgü yayın duyuru mesajını sil.",
					},
					Type: discordgo.ApplicationCommandOptionSubCommand,
					Options: []*discordgo.ApplicationCommandOption{
						{
							Type:        discordgo.ApplicationCommandOptionString,
							Name:        "twitch-username-or-url",
							Description: "Twitch profile url or username",
							DescriptionLocalizations: map[discordgo.Locale]string{
								discordgo.Turkish: "Twitch kullanıcı profil linki veya kullanıcı adı",
							},
							Required: true,
						},
					},
				},
				{
					Name:        "stream-event-channel",
					Description: "Delete the live stream announcements channel setting to create Discord events for live streams.",
					DescriptionLocalizations: map[discordgo.Locale]string{
						discordgo.Turkish: "Canlı yayınların Discord etkinliklerini oluşturmak için canlı yayın duyuruları kanalını seç.",
					},
					Type: discordgo.ApplicationCommandOptionSubCommand,
					Options: []*discordgo.ApplicationCommandOption{
						{
							Type:        discordgo.ApplicationCommandOptionChannel,
							Name:        "channel-name",
							Description: "The text channel where Twitch live stream announcements will be unfollowed",
							DescriptionLocalizations: map[discordgo.Locale]string{
								discordgo.Turkish: "Twitch yayın duyurularının takipten çıkarılacağı yazı kanalı",
							},
							ChannelTypes: []discordgo.ChannelType{
								discordgo.ChannelTypeGuildNews,
								discordgo.ChannelTypeGuildText,
							},
							Required: true,
						},
					},
				},
			},
		},
		{
			Name:        "invite",
			Description: "Senchabot Discord bot invite url.",
		},
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

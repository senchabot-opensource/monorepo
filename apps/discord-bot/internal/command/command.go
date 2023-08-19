package command

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/client"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/db"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service/streamer"
)

const errorMessage = "İşlem gerçekleştirilirken hata oluştu. Hata kodu: "

type Command interface {
	GetCommands() map[string]func(context context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, db db.MySQL)
	DeployCommands(discordClient *discordgo.Session)
}

type commands struct {
}

func NewCommands() Command {
	return &commands{}
}

func (c *commands) GetCommands() map[string]func(context context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, db db.MySQL) {
	// TODO: command aliases
	var commands = map[string]func(context context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, db db.MySQL){
		"acmd":   c.AddCmdCommand,
		"ucmd":   c.UpdateCmdCommand,
		"dcmd":   c.DeleteCmdCommand,
		"acmda":  c.AddCmdAliasCommand,
		"dcmda":  c.DeleteCmdAliasCommand,
		"set":    c.SetCommand,
		"delete": c.DeleteCommand,
		"purge":  c.PurgeCommand,
		"invite": c.InviteCommand,
	}

	return commands
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
	commandMetadatas           = []*discordgo.ApplicationCommand{
		{
			Name:                     "acmd",
			Description:              "Add a new custom command.",
			DefaultMemberPermissions: &setdeletePermissions,
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
			DefaultMemberPermissions: &setdeletePermissions,
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
			DefaultMemberPermissions: &setdeletePermissions,
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
			DefaultMemberPermissions: &setdeletePermissions,
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
			DefaultMemberPermissions: &setdeletePermissions,
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

const FOURTEEN_DAYS = 24 * 14

func checkTimeOlderThan(msgTimestamp time.Time, tNumber int) bool {
	return int(time.Until(msgTimestamp).Abs().Hours()) < tNumber
}

func containsLowerCase(s string, substr string) bool {
	return strings.Contains(strings.ToLower(s), substr)
}

func IsChannelNameNotGiven(optionsLen int) bool {
	return optionsLen < 2
}

func GetTwitchUserInfo(twitchUsername string) (string, *client.TwitchUserInfo) {
	userInfo, err := client.GetTwitchUserInfo(twitchUsername)
	if err != nil {
		return fmt.Sprintf("`%v` kullanıcı adlı Twitch yayıncısı Twitch'te bulunamadı.", twitchUsername), nil
	}

	return "", userInfo
}

func CheckIfTwitchStreamerExist(ctx context.Context, twitchUsername string, uInfo *client.TwitchUserInfo, s *discordgo.Session, i *discordgo.InteractionCreate, db db.MySQL) (string, bool) {
	liveAnnoData, err := db.GetDiscordTwitchLiveAnno(ctx, uInfo.ID, i.GuildID)
	if err != nil {
		log.Printf("There was an error while checking the Discord Twitch live announcements: %v", err)
		return errorMessage + "#XYXX", false
	}
	if liveAnnoData != nil {
		channel, err := s.Channel(liveAnnoData.AnnoChannelID)
		if err != nil {
			log.Printf("Error while fetching the channel data from Discord API: %v", err)
			return errorMessage + "#YXXX", false
		}
		return fmt.Sprintf("`%v` kullanıcı adlı Twitch yayıncısının duyuları `%v` isimli yazı kanalı için ekli.", twitchUsername, channel.Name), true
	}
	return "", false
}

func SetTwitchStreamer(ctx context.Context, uInfo *client.TwitchUserInfo, channelId, channelName, guildId, creatorUsername string, db db.MySQL) string {
	added, err := db.AddDiscordTwitchLiveAnnos(ctx, uInfo.Login, uInfo.ID, channelId, guildId, creatorUsername)
	if err != nil {
		log.Printf("Error while adding Discord Twitch live announcement: %v", err)

		return fmt.Sprintf("`%v` kullanıcı adlı Twitch yayıncısı veritabanı hatasından dolayı eklenemedi.", uInfo.Login)
	}

	if !added && err == nil {
		streamer.SetStreamerData(guildId, uInfo.Login, channelId)
		return fmt.Sprintf("`%v` kullanıcı adlı Twitch yayıncısı varitabanında bulunmakta. Ancak... Twitch yayıncısının yayın duyurularının yapılacağı kanalı `%v` yazı kanalı olarak güncellendi.", uInfo.Login, channelName)
	}

	if added {
		streamer.SetStreamerData(guildId, uInfo.Login, channelId)
		return fmt.Sprintf("`%v` kullanıcı adlı Twitch yayıncısının yayın duyuruları `%v` isimli yazı kanalı için aktif edildi.", uInfo.Login, channelName)
	}

	return "Twitch yayıncısı eklenirken bir sorun oluştu."
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

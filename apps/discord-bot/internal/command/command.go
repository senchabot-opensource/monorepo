package command

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-dev/monorepo/apps/discord-bot/client"
	"github.com/senchabot-dev/monorepo/apps/discord-bot/internal/db"
	"github.com/senchabot-dev/monorepo/apps/discord-bot/internal/service/streamer"
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
		"set":    c.SetCommand,
		"delete": c.DeleteCommand,
		"purge":  c.PurgeCommand,
	}

	return commands
}

func (c *commands) DeployCommands(discordClient *discordgo.Session) {
	fmt.Println("DEPLOYING SLASH COMMANDS...")
	registeredCommands := make([]*discordgo.ApplicationCommand, len(commandMetadatas))
	for i, v := range commandMetadatas {
		cmd, err := discordClient.ApplicationCommandCreate(os.Getenv("CLIENT_ID"), "", v)
		if err != nil {
			fmt.Printf("Slash command '%v' cannot created: %v", v.Name, err)
		}
		registeredCommands[i] = cmd
	}
}

var (
	purgePermissions     int64 = discordgo.PermissionManageEvents + discordgo.PermissionManageMessages
	setdeletePermissions int64 = discordgo.PermissionManageChannels
	commandMetadatas           = []*discordgo.ApplicationCommand{
		{
			Name:                     "set",
			Description:              "Discord botunu yapılandırma ayarları",
			DefaultMemberPermissions: &setdeletePermissions,
			Options: []*discordgo.ApplicationCommandOption{
				{
					Name:        "stream-anno-default-channel",
					Description: "Yayın duyuru mesajlarının atılacağı varsayılan kanalı ayarla.",
					Type:        discordgo.ApplicationCommandOptionSubCommand,
					Options: []*discordgo.ApplicationCommandOption{
						{
							Type:        discordgo.ApplicationCommandOptionChannel,
							Name:        "channel-name",
							Description: "Yazı kanalı",
							ChannelTypes: []discordgo.ChannelType{
								discordgo.ChannelTypeGuildText,
							},
							Required: true,
						},
					},
				},
				{
					Name:        "stream-anno-default-content",
					Description: "Varsayılan yayın duyuru mesajı ayarla.",
					Type:        discordgo.ApplicationCommandOptionSubCommand,
					Options: []*discordgo.ApplicationCommandOption{
						{
							Type:        discordgo.ApplicationCommandOptionString,
							Name:        "announcement-content",
							Description: "Twitch yayını mesaj duyuru içeriği ({twitch.username} {twitch.url} {stream.category} {stream.title})",
							Required:    true,
						},
					},
				},
				{
					Name:        "stream-anno-custom-content",
					Description: "Yayıncıya özgü yayın duyuru mesajı ayarla.",
					Type:        discordgo.ApplicationCommandOptionSubCommand,
					Options: []*discordgo.ApplicationCommandOption{
						{
							Type:        discordgo.ApplicationCommandOptionString,
							Name:        "twitch-username-or-url",
							Description: "Twitch kullanıcı profil linki veya kullanıcı adı",
							Required:    true,
						},
						{
							Type:        discordgo.ApplicationCommandOptionString,
							Name:        "announcement-content",
							Description: "Twitch yayını mesaj duyuru içeriği ({twitch.username} {twitch.url} {stream.category} {stream.title})",
							Required:    true,
						},
					},
				},
				{
					Name:        "streamer",
					Description: "Yayın duyuru mesajı atılacak yayıncıyı ekle. Özel kanal atayabilirsin.",
					Type:        discordgo.ApplicationCommandOptionSubCommand,
					Options: []*discordgo.ApplicationCommandOption{
						{
							Type:        discordgo.ApplicationCommandOptionString,
							Name:        "twitch-username-or-url",
							Description: "Twitch kullanıcı profil linki veya kullanıcı adı",
							Required:    true,
						},
						{
							Type:        discordgo.ApplicationCommandOptionChannel,
							Name:        "channel-name",
							Description: "Duyuruların yapılacağı yazı kanalı adı",
							ChannelTypes: []discordgo.ChannelType{
								discordgo.ChannelTypeGuildText,
							},
							Required: false,
						},
					},
				},
				{
					Name:        "stream-event-channel",
					Description: "Etkinlik oluşturulacak yayın duyurularının kanalını seç.",
					Type:        discordgo.ApplicationCommandOptionSubCommand,
					Options: []*discordgo.ApplicationCommandOption{
						{
							Type:        discordgo.ApplicationCommandOptionChannel,
							Name:        "channel-name",
							Description: "Twitch yayın duyurularının takip edileceği yazı kanalı",
							ChannelTypes: []discordgo.ChannelType{
								discordgo.ChannelTypeGuildText,
							},
							Required: true,
						},
					},
				},
			},
		},
		{
			Name:                     "purge",
			Description:              "Purge",
			DefaultMemberPermissions: &purgePermissions,
			Options: []*discordgo.ApplicationCommandOption{
				{
					Name:        "events",
					Description: "Tüm zamanlanmış etkinlikleri iptal et",
					Type:        discordgo.ApplicationCommandOptionSubCommand,
				},
				{
					Name:        "last-100-channel-messages",
					Description: "Purge messages older than 14 days containing certain characters or sent by centain username",
					Type:        discordgo.ApplicationCommandOptionSubCommand,
					Options: []*discordgo.ApplicationCommandOption{
						{
							Name:        "message-content-contains",
							Description: "certain characters that contain in messages",
							Type:        discordgo.ApplicationCommandOptionString,
						},
						{
							Name:        "user-name-contains",
							Description: "certain characters that contain in user's name or nickname",
							Type:        discordgo.ApplicationCommandOptionString,
						},
					},
				},
			},
		},
		{
			Name:                     "delete",
			Description:              "Yapılandırma ayarlarını kaldır",
			DefaultMemberPermissions: &setdeletePermissions,
			Options: []*discordgo.ApplicationCommandOption{
				{
					Name:        "stream-anno-default-channel",
					Description: "Yayın duyuru mesajlarının atılacağı varsayılan kanal ayarını kaldır.",
					Type:        discordgo.ApplicationCommandOptionSubCommand,
				},
				{
					Name:        "stream-anno-default-content",
					Description: "Varsayılan yayın duyuru mesajını sil.",
					Type:        discordgo.ApplicationCommandOptionSubCommand,
				},
				{
					Name:        "streamer",
					Description: "Yayın duyuru mesajı atılan yayıncıyı sil.",
					Type:        discordgo.ApplicationCommandOptionSubCommand,
					Options: []*discordgo.ApplicationCommandOption{
						{
							Type:        discordgo.ApplicationCommandOptionString,
							Name:        "twitch-username-or-url",
							Description: "Twitch kullanıcı profil linki veya kullanıcı adı",
							Required:    true,
						},
					},
				},
				{
					Name:        "stream-anno-custom-content",
					Description: "Yayıncıya özgü yayın duyuru mesajını sil.",
					Type:        discordgo.ApplicationCommandOptionSubCommand,
					Options: []*discordgo.ApplicationCommandOption{
						{
							Type:        discordgo.ApplicationCommandOptionString,
							Name:        "twitch-username-or-url",
							Description: "Twitch kullanıcı profil linki veya kullanıcı adı",
							Required:    true,
						},
					},
				},
				{
					Name:        "stream-event-channel",
					Description: "Etkinlik oluşturulacak yayın duyuruları kanalı ayarını kaldır.",
					Type:        discordgo.ApplicationCommandOptionSubCommand,
					Options: []*discordgo.ApplicationCommandOption{
						{
							Type:        discordgo.ApplicationCommandOptionChannel,
							Name:        "channel-name",
							Description: "Twitch yayın duyurularının takipten çıkarılacağı yazı kanalı",
							ChannelTypes: []discordgo.ChannelType{
								discordgo.ChannelTypeGuildText,
							},
							Required: true,
						},
					},
				},
			},
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
		log.Printf("Error while getting Twitch user info: %v", err)
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

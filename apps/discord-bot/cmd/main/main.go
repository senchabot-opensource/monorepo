package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"sync"

	"github.com/bwmarrin/discordgo"
	"github.com/joho/godotenv"
	"github.com/senchabot-dev/monorepo/apps/discord-bot/client"
	"github.com/senchabot-dev/monorepo/apps/discord-bot/internal/db"
	"github.com/senchabot-dev/monorepo/apps/discord-bot/internal/helpers"
	"github.com/senchabot-dev/monorepo/apps/discord-bot/internal/service/event"
	"github.com/senchabot-dev/monorepo/apps/discord-bot/internal/service/streamer"
)

var (
	defaultMemberPermissions int64 = discordgo.PermissionManageEvents
	commands                       = []*discordgo.ApplicationCommand{
		{
			Name:                     "set",
			Description:              "Discord botunu yapılandırma ayarları",
			DefaultMemberPermissions: &defaultMemberPermissions,
			Options: []*discordgo.ApplicationCommandOption{
				{
					Name:        "stream-default-anno-channel",
					Description: "Twitch canlı yayın duyuruları için varsayılan bir yazı kanalı ekle",
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
					Name:        "stream-announcement-text",
					Description: "Twitch canlı yayın duyuruları için duyuru metni ekle",
					Type:        discordgo.ApplicationCommandOptionSubCommand,
					Options: []*discordgo.ApplicationCommandOption{
						{
							Type:        discordgo.ApplicationCommandOptionString,
							Name:        "announcement-text",
							Description: "Twitch yayini duyuru metni",
							Required:    true,
						},
					},
				},
				{
					Name:        "streamer",
					Description: "Canlı yayın duyuruları için Twitch yayıncısı ekle",
					Type:        discordgo.ApplicationCommandOptionSubCommand,
					Options: []*discordgo.ApplicationCommandOption{
						{
							Type:        discordgo.ApplicationCommandOptionString,
							Name:        "twitch-user-name-or-url",
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
					Description: "Zamanlanmış etkinliklerin oluşturulması için yazı kanalı ekle",
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
			DefaultMemberPermissions: &defaultMemberPermissions,
			Options: []*discordgo.ApplicationCommandOption{
				{
					Name:        "events",
					Description: "Tüm zamanlanmış etkinlikleri iptal et",
					Type:        discordgo.ApplicationCommandOptionSubCommand,
				},
			},
		},
		{
			Name:                     "delete",
			Description:              "Yapılandırma ayarlarını kaldır",
			DefaultMemberPermissions: &defaultMemberPermissions,
			Options: []*discordgo.ApplicationCommandOption{
				{
					Name:        "stream-default-anno-channel",
					Description: "Twitch canlı yayın duyuruları için varsayılan yazı kanalı kanalı ayarını kaldır",
					Type:        discordgo.ApplicationCommandOptionSubCommand,
				},
				{
					Name:        "streamer",
					Description: "Twitch yayıncısı için canlı yayın duyurularını iptal et",
					Type:        discordgo.ApplicationCommandOptionSubCommand,
					Options: []*discordgo.ApplicationCommandOption{
						{
							Type:        discordgo.ApplicationCommandOptionString,
							Name:        "twitch-user-name-or-url",
							Description: "Twitch kullanıcı profil linki veya kullanıcı adı",
							Required:    true,
						},
					},
				},
				{
					Name:        "stream-event-channel",
					Description: "Zamanlanmış etkinliklerin oluşturulmasını iptal et",
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

	errorMessage = "İşlem gerçekleştirilirken hata oluştu. Hata kodu: "

	commandHandlers = map[string]func(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, db db.MySQL){
		"set": func(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, db db.MySQL) {
			options := i.ApplicationCommandData().Options

			switch options[0].Name {
			case "stream-default-anno-channel":
				options = options[0].Options
				channelId := options[0].ChannelValue(s).ID
				channelName := options[0].ChannelValue(s).Name

				_, err := db.SetDiscordBotConfig(ctx, i.GuildID, "stream_default_anno_channel", channelId)
				if err != nil {
					log.Printf("Error while setting Discord bot config: %v", err)
					ephemeralRespond(s, i, errorMessage+"#0001")
					return
				}

				ephemeralRespond(s, i, "`"+channelName+"` isimli kanal varsayılan duyuru kanalı olarak ayarlandı.")

			case "stream-announcement-text":
				options = options[0].Options
				annoText := options[0].StringValue()

				_, err := db.SetDiscordBotConfig(ctx, i.GuildID, "stream_anno_text", annoText)
				if err != nil {
					log.Printf("Error while setting Discord bot config: %v", err)
					ephemeralRespond(s, i, errorMessage+"#0001")
					return
				}

				ephemeralRespond(s, i, "Yayin duyuru metni ayarlandi: "+annoText)

			case "stream-event-channel":
				options = options[0].Options
				channelId := options[0].ChannelValue(s).ID
				channelName := options[0].ChannelValue(s).Name

				ok, err := db.AddAnnouncementChannel(ctx, channelId, i.GuildID, i.Member.User.Username)
				if err != nil {
					log.Println(err)
					ephemeralRespond(s, i, errorMessage+"#0002")
					return
				}
				if !ok {
					ephemeralRespond(s, i, fmt.Sprintf("`%v` isimli kanal Twitch yayın duyurusu etkinlikleri için daha önce eklenmiş.", channelName))
					return
				}

				ephemeralRespond(s, i, fmt.Sprintf("`%v` isimli kanal Twitch yayın duyurusu etkinlikleri için listeye eklendi.", channelName))

			case "streamer":
				options = options[0].Options
				twitchUsername := options[0].StringValue()
				commandUsername := i.Member.User.Username
				twitchUsername = helpers.ParseTwitchUsernameURLParam(twitchUsername)

				response0, uInfo := GetTwitchUserInfo(twitchUsername)
				if response0 != "" {
					ephemeralRespond(s, i, response0)
					return
				}

				response1, ok := CheckIfTwitchStreamerExist(ctx, twitchUsername, uInfo, s, i, db)
				if IsChannelNameGiven(len(options)) && ok {
					ephemeralRespond(s, i, response1)
					return
				}

				if IsChannelNameGiven(len(options)) {
					channelData, err := db.GetDiscordBotConfig(ctx, i.GuildID, "stream_default_anno_channel")
					if err != nil {
						log.Printf("Error while getting Discord bot config: %v", err)
						ephemeralRespond(s, i, errorMessage+"#0000")
						return
					}
					if channelData == nil {
						ephemeralRespond(s, i, "Twitch yayıncısı eklerken daha önce `/set stream-default-anno-channel channel-name` komutuyla varsayılan duyuru kanalı eklemiş olmalı veya isteğe bağlı kanal adını belirtmelisiniz.")
						return
					}

					ch, err := s.Channel(channelData.Value)
					if err != nil {
						ephemeralRespond(s, i, errorMessage+"#XXXY")
						return
					}

					resp := SetTwitchStreamer(ctx, uInfo, channelData.Value, ch.Name, i.GuildID, commandUsername, db)
					ephemeralRespond(s, i, resp)
					return
				}

				channelId := options[1].ChannelValue(s).ID
				channelName := options[1].ChannelValue(s).Name

				streamerData, err := db.GetDiscordTwitchLiveAnno(ctx, uInfo.ID, i.GuildID)
				if err != nil {
					fmt.Println("streamerData, err:", err)
					return
				}

				if streamerData != nil && channelId == streamerData.AnnoChannelID {
					ephemeralRespond(s, i, fmt.Sprintf("`%v` kullanıcı adlı Twitch yayıncısı `%v` kanalına canlı yayın duyuruları daha önce için eklenmiş.", twitchUsername, channelName))
					return
				}

				resp := SetTwitchStreamer(ctx, uInfo, channelId, channelName, i.GuildID, commandUsername, db)
				ephemeralRespond(s, i, resp)
			}
		},
		"delete": func(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, db db.MySQL) {
			options := i.ApplicationCommandData().Options

			switch options[0].Name {
			case "stream-default-notif-channel":
				_, err := db.DeleteDiscordBotConfig(ctx, i.GuildID, "stream_default_anno_channel")
				if err != nil {
					log.Printf("Error while deleting Discord bot config: %v", err)
					ephemeralRespond(s, i, errorMessage+"#0001")
					return
				}

				ephemeralRespond(s, i, "Varsayılan Twitch canlı yayın duyuru kanalı ayarı kaldırıldı.")

			case "streamer":
				options = options[0].Options
				twitchUsername := options[0].StringValue()
				twitchUsername = helpers.ParseTwitchUsernameURLParam(twitchUsername)

				response0, uInfo := GetTwitchUserInfo(twitchUsername)
				if response0 != "" {
					ephemeralRespond(s, i, response0)
					return
				}

				ok, err := db.DeleteDiscordTwitchLiveAnno(ctx, uInfo.ID, i.GuildID)
				if err != nil {
					ephemeralRespond(s, i, errorMessage+"#XXXX")
					return
				}

				if !ok {
					ephemeralRespond(s, i, "`"+twitchUsername+"` kullanıcı adlı Twitch yayıncısı veritabanında bulunamadı.")
					return
				}

				streamers := streamer.GetStreamersData(i.GuildID)
				delete(streamers, uInfo.Login)
				ephemeralRespond(s, i, "`"+uInfo.Login+"` kullanıcı adlı Twitch streamer veritabanından silindi.")

			case "stream-event-channel":
				options = options[0].Options
				channelId := options[0].ChannelValue(s).ID
				channelName := options[0].ChannelValue(s).Name

				ok, err := db.DeleteAnnouncementChannel(ctx, channelId)
				if err != nil {
					ephemeralRespond(s, i, errorMessage+"#XXYX")
					log.Println("Error while deleting announcement channel:", err)
					return
				}
				if !ok {
					ephemeralRespond(s, i, "`"+channelName+"` isimli yazı kanalı yayın etkinlik yazı kanalları listesinde bulunamadı.")
					return
				}
				ephemeralRespond(s, i, "`"+channelName+"` isimli yazı kanalı yayın etkinlik yazı kanalları listesinden kaldırıldı.")
			}
		},
		"purge": func(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, db db.MySQL) {
			options := i.ApplicationCommandData().Options

			switch options[0].Name {
			case "events":
				events, err := s.GuildScheduledEvents(i.GuildID, false)
				if err != nil {
					log.Println(err)
					ephemeralRespond(s, i, errorMessage+"#1011")
				}

				for _, e := range events {
					s.GuildScheduledEventDelete(i.GuildID, e.ID)
				}

				ephemeralRespond(s, i, "Tüm planlanmış etkinlikler silindi.")
			}
		},
	}
)

func IsChannelNameGiven(optionsLen int) bool {
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

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	client.InitTwitchOAuth2Token()

	discordClient, _ := discordgo.New("Bot " + os.Getenv("TOKEN"))

	var wg sync.WaitGroup

	db := db.NewMySQL()
	ctx := context.Background()

	discordClient.AddHandler(func(s *discordgo.Session, r *discordgo.Ready) {
		guilds := s.State.Guilds
		for _, g := range guilds {
			go event.CheckLiveStreams(s, ctx, db, g.ID)
		}

		go event.CheckLiveStreamScheduledEvents(s)
		fmt.Println("Bot is ready. Logged in as:", s.State.User.Username)
	})

	appCmds, _ := discordClient.ApplicationCommands(os.Getenv("CLIENT_ID"), "1051582387433254993")
	for _, name := range appCmds {
		fmt.Println("name", name.Name)
		err := discordClient.ApplicationCommandDelete(name.ApplicationID, name.GuildID, name.ID)
		if err != nil {
			log.Fatalf("Cannot delete slash command %v: %q", name, err)
		}
	}

	discordClient.AddHandler(func(s *discordgo.Session, m *discordgo.MessageCreate) {
		//if m.Author.Bot {
		wg.Add(1)
		announcementChs, err := db.GetAnnouncementChannels(ctx)
		if err != nil {
			log.Println(err)
			return
		}

		for _, ch := range announcementChs {
			if ch.ChannelID == m.ChannelID {
				event.CreateLiveStreamScheduledEvent(s, m.Content, m.GuildID, &wg)
			}
		}
		//}
	})

	discordClient.AddHandler(func(s *discordgo.Session, i *discordgo.InteractionCreate) {
		ctx := context.Background()
		if h, ok := commandHandlers[i.ApplicationCommandData().Name]; ok {
			h(ctx, s, i, *db)
		}
	})

	fmt.Println("DEPLOYING SLASH COMMANDS...")
	registeredCommands := make([]*discordgo.ApplicationCommand, len(commands))
	for i, v := range commands {
		cmd, err := discordClient.ApplicationCommandCreate(os.Getenv("CLIENT_ID"), "", v)
		if err != nil {
			fmt.Printf("Slash command '%v' cannot created: %v", v.Name, err)
		}
		registeredCommands[i] = cmd
	}

	err = discordClient.Open()
	if err != nil {
		log.Fatal("Cannot open the session: ", err)
	}
	defer discordClient.Close()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)
	<-stop
	wg.Done()
	log.Println("Graceful shutdown")

	//wg.Wait()
}

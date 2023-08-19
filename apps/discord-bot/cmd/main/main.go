package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"regexp"
	"strings"
	"sync"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/client"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/command"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/db"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/helpers"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service/event"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service/streamer"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot"

	cmdsrvc "github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service/command"
)

func main() {
	//dotErr := godotenv.Load()
	//if dotErr != nil {
	//log.Fatal("Error loading .env file", dotErr.Error())
	//}

	client.InitTwitchOAuth2Token()

	discordClient, _ := discordgo.New("Bot " + os.Getenv("TOKEN"))

	var wg sync.WaitGroup

	db := db.NewMySQL()
	ctx := context.Background()

	discordClient.AddHandler(func(s *discordgo.Session, r *discordgo.Ready) {
		go event.CheckLiveStreamScheduledEvents(s)

		fmt.Println("Bot is ready. Logged in as:", s.State.User.Username)
	})

	discordClient.AddHandler(func(s *discordgo.Session, g *discordgo.GuildCreate) {
		err := db.AddServerToDB(ctx, g.ID, g.Name, g.OwnerID)
		if err != nil {
			fmt.Println(err)
		}
		streamer.StartCheckLiveStreams(s, ctx, db, g.ID)
	})

	discordClient.AddHandler(func(s *discordgo.Session, g *discordgo.GuildDelete) {
		err := db.DeleteServerFromDB(ctx, g.ID)
		if err != nil {
			fmt.Println(err)
		}
		streamer.StopCheckLiveStreams(g.ID)
		streamer.DeleteServerFromData(g.ID)
		_, err = db.DeleteDiscordTwitchLiveAnnosByGuildId(ctx, g.ID)
		if err != nil {
			fmt.Println("[GuildDelete] db.DeleteDiscordTwitchLiveAnnosByGuildId: ", err.Error())
		}
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
		if m.Author.Bot {
			announcementChs, err := db.GetAnnouncementChannels(ctx) // redis or memory db?
			if err != nil {
				log.Println(err)
				return
			}

			for _, ch := range announcementChs {
				if ch.ChannelID == m.ChannelID {
					event.CreateLiveStreamScheduledEvent(s, m.Content, m.Embeds, m.GuildID)
				}
			}
		}

		if m.Author.ID == s.State.User.ID {
			return
		}

		cmdName, params := helpers.ParseMessage(m.Content)
		if cmdName == "" {
			return
		}

		// HANDLE COMMAND ALIASES
		commandAlias, cmdAliasErr := db.GetCommandAlias(ctx, cmdName, m.GuildID)
		if cmdAliasErr != nil {
			fmt.Println(cmdAliasErr.Error())
		}

		if commandAlias != nil {
			cmdName = *commandAlias
		}
		// HANDLE COMMAND ALIASES

		cmdsrvc.RunCommand(s, ctx, db, cmdName, m)

		if cmdName == "sozluk" {
			sozlukResp, err := gosenchabot.SozlukCommand(params)
			if err != nil {
				log.Println(err)
				return
			}
			s.ChannelMessageSend(m.ChannelID, sozlukResp)
		}
	})

	discordClient.AddHandler(func(s *discordgo.Session, i *discordgo.MessageReactionAdd) {
		msg, err := s.ChannelMessage(i.ChannelID, i.MessageID)
		if err != nil {
			fmt.Println("There was an error while getting channel message in MessageReactionAdd: ", err.Error())
			return
		}

		goodMorningRegexp := regexp.MustCompile(`(?i)g(ü|u)nayd(ı|i)`)
		if goodMorningRegexp.MatchString(msg.Content) && i.Emoji.Name == "🌞" {
			err = s.MessageReactionAdd(msg.ChannelID, msg.ID, "🌞")
			if err != nil {
				fmt.Println("MessageReactionAdd Error:", err)
			}
		}
	})

	command := command.NewCommands()

	discordClient.AddHandler(func(s *discordgo.Session, i *discordgo.InteractionCreate) {
		ctx := context.Background()
		commandHandlers := command.GetCommands()
		if h, ok := commandHandlers[i.ApplicationCommandData().Name]; ok {
			h(ctx, s, i, *db)
			options := []string{}
			for _, v := range i.ApplicationCommandData().Options {
				options = append(options, v.Name)
				if len(v.Options) > 0 {
					for _, vj := range v.Options {
						switch vj.Type.String() {
						case "String":
							options = append(options, fmt.Sprintf(`"%v: %v"`, vj.Name, vj.StringValue()))
						case "Channel":
							options = append(options, fmt.Sprintf(`"%v: %v"`, vj.Name, vj.ChannelValue(s).Name))
						}
					}
				}
			}
			db.SaveBotCommandActivity(ctx, "/"+i.ApplicationCommandData().Name+" "+strings.Join(options, " "), i.GuildID, i.Member.User.Username, i.Member.User.ID)
		}
	})

	command.DeployCommands(discordClient)

	err := discordClient.Open()
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

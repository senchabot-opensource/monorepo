package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"strings"
	"sync"

	"github.com/bwmarrin/discordgo"
	"github.com/joho/godotenv"
	"github.com/senchabot-dev/monorepo/apps/discord-bot/client"
	"github.com/senchabot-dev/monorepo/apps/discord-bot/internal/command"
	"github.com/senchabot-dev/monorepo/apps/discord-bot/internal/db"
	"github.com/senchabot-dev/monorepo/apps/discord-bot/internal/helpers"
	"github.com/senchabot-dev/monorepo/apps/discord-bot/internal/service/event"
)

const (
	gqlUrl    = "https://gql.dev.kamp.us/graphql"
	sozlukUrl = "https://sozluk.dev.kamp.us"

	SOZLUK_COMMAND_INFO = "For example: !sozluk [term-name]"
)

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
		if m.Author.ID == s.State.User.ID {
			return
		}

		if m.Author.Bot {
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
		}

		cmdName, params := helpers.ParseMessage(m.Content)
		if cmdName == "" {
			return
		}

		if cmdName == "sozluk" {
			if check := helpers.IsCommandParamsLengthEqualToOne(params); !check {
				s.ChannelMessageSend(m.ChannelID, SOZLUK_COMMAND_INFO)
				return
			}

			var sozlukTerm = strings.ToLower(strings.TrimSpace(params[0]))

			query := fmt.Sprintf(`{
				sozluk {
					term(input: {id: "%s"}) {
						title,
						body {
							raw
						}
					}
				}
			}`, sozlukTerm)

			response, err := helpers.FetchGraphQL(gqlUrl, query)
			if err != nil {
				fmt.Println("Error:", err)
				return
			}

			var gqlResponse helpers.SozlukGraphQLResponse
			err = json.Unmarshal(response, &gqlResponse)
			if err != nil {
				fmt.Println("json.Unmarshal error:", err)
				return
			}

			termTitle := strings.TrimSpace(gqlResponse.Data.Sozluk.Term.Title)
			termDesc := strings.TrimSpace(gqlResponse.Data.Sozluk.Term.Body.Raw)

			if termDesc == "" {
				s.ChannelMessageSend(m.ChannelID, fmt.Sprintf(`the term "%s" not found`, sozlukTerm))
				return
			}

			if len(termDesc) > 400 {
				termDesc = termDesc[:250]

				s.ChannelMessageSend(m.ChannelID, termTitle+": "+termDesc+"... "+sozlukUrl+"/"+sozlukTerm)
				return
			}

			s.ChannelMessageSend(m.ChannelID, termTitle+": "+termDesc)
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
							options = append(options, vj.Name+": "+vj.StringValue())
						case "Channel":
							options = append(options, vj.Name+": "+vj.ChannelValue(s).Name)
						}
					}
				}
			}
			db.SaveBotCommandActivity(ctx, "/"+i.ApplicationCommandData().Name+" "+strings.Join(options, " "), i.GuildID, i.Member.User.Username)
		}
	})

	command.DeployCommands(discordClient)

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

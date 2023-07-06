package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"regexp"
	"sync"
	"time"

	"github.com/bwmarrin/discordgo"
	"github.com/joho/godotenv"
	"golang.org/x/oauth2/clientcredentials"
	"golang.org/x/oauth2/twitch"
)

var (
	defaultMemberPermissions int64 = discordgo.PermissionManageEvents
	commands                       = []*discordgo.ApplicationCommand{
		{
			Name:                     "event",
			Description:              "Manage and configure scheduled events",
			DefaultMemberPermissions: &defaultMemberPermissions,
			Options: []*discordgo.ApplicationCommandOption{
				{
					Name:        "configure-live-stream-events",
					Description: "Configure Twitch Live Stream Scheduled Events",
					Type:        discordgo.ApplicationCommandOptionSubCommand,
					Options: []*discordgo.ApplicationCommandOption{
						{
							Type:        discordgo.ApplicationCommandOptionChannel,
							Name:        "announcement-channel-name",
							Description: "Add an announcement channel to be monitored to create Discord scheduled events",
							ChannelTypes: []discordgo.ChannelType{
								discordgo.ChannelTypeGuildText,
							},
							Required: true,
						},
					},
				},
				{
					Name:        "purge",
					Description: "Purge Scheduled Events",
					Type:        discordgo.ApplicationCommandOptionSubCommand,
				},
			},
		},
	}

	commandHandlers = map[string]func(s *discordgo.Session, i *discordgo.InteractionCreate){
		"event": func(s *discordgo.Session, i *discordgo.InteractionCreate) {
			options := i.ApplicationCommandData().Options
			content := ""

			switch options[0].Name {
			case "configure-auto-events":
				options = options[0].Options

				content = "Selected channel: " + options[0].ChannelValue(s).Name
			case "purge":
				events, err := s.GuildScheduledEvents(i.GuildID, false)
				if err != nil {
					fmt.Println("s.GuildScheduledEvents")
				}

				for _, e := range events {
					s.GuildScheduledEventDelete(i.GuildID, e.ID)
				}

				content = "All scheduled events deleted."
			}

			s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseChannelMessageWithSource,
				Data: &discordgo.InteractionResponseData{
					Content: content,
					Flags:   discordgo.MessageFlagsEphemeral,
				},
			})
		},
	}

	twitchAPI         = "https://api.twitch.tv/helix"
	oauth2Config      *clientcredentials.Config
	twitchAccessToken string
)

func initTwitchOAuth2Token() {
	oauth2Config = &clientcredentials.Config{
		ClientID:     os.Getenv("TWITCH_CLIENT_ID"),
		ClientSecret: os.Getenv("TWITCH_CLIENT_SECRET"),
		TokenURL:     twitch.Endpoint.TokenURL,
	}

	token, err := oauth2Config.Token(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(token.Expiry)

	twitchAccessToken = token.AccessToken
}

func getURL(domain, messageContent string) string {
	pattern := fmt.Sprintf(`%s\S*`, domain)
	re := regexp.MustCompile(pattern)
	match := re.FindString(messageContent)

	if match != "" {
		return "https://" + match
	}

	return ""
}

func getTwitchUsernameFromURL(url string) string {
	pattern := `https?:\/\/(?:www\.)?twitch\.tv\/([a-zA-Z0-9_]+)`
	re := regexp.MustCompile(pattern)
	matches := re.FindStringSubmatch(url)

	fmt.Println("matches", matches)

	if len(matches) > 1 {
		return matches[1]
	}

	return ""
}

func createLiveStreamScheduledEvent(s *discordgo.Session, msgContent, guildId string, wg *sync.WaitGroup) {
	defer wg.Done()

	url := getURL("twitch.tv", msgContent)

	username := getTwitchUsernameFromURL(url)

	if url == "" || username == "" {
		return
	}

	wg.Add(1)

	events, err := s.GuildScheduledEvents(guildId, false)
	if err != nil {
		fmt.Println("s.GuildScheduledEvents")
	}

	for _, e := range events {
		if e.Creator.Bot && e.EntityMetadata.Location == url {
			return
		}
	}

	startingTime := time.Now().Add(1 * time.Minute)
	endingTime := startingTime.Add(16 * time.Hour)

	scheduledEvent, err := s.GuildScheduledEventCreate(guildId, &discordgo.GuildScheduledEventParams{
		Name:               username + " is live!",
		ScheduledStartTime: &startingTime,
		ScheduledEndTime:   &endingTime,
		EntityType:         discordgo.GuildScheduledEventEntityTypeExternal,
		EntityMetadata: &discordgo.GuildScheduledEventEntityMetadata{
			Location: url,
		},
		PrivacyLevel: discordgo.GuildScheduledEventPrivacyLevelGuildOnly,
	})
	if err != nil {
		log.Printf("Error while creating scheduled event: %v", err)
		wg.Done()
		return
	}

	fmt.Println("Created scheduled event: ", scheduledEvent.Name)
	wg.Done()
}

func checkTwitchStreamStatus(username string) (bool, string) {
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/streams?user_login=%s", twitchAPI, username), nil)
	if err != nil {
		log.Printf("Error while creating Twitch API request: %v", err)
		return false, ""
	}

	req.Header.Set("Client-ID", os.Getenv("TWITCH_CLIENT_ID"))
	req.Header.Set("Authorization", "Bearer "+twitchAccessToken)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error while checking stream status: %v", err)
		return false, ""
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Printf("Twitch API request failed with status code: %d", resp.StatusCode)
		return false, ""
	}

	var data struct {
		Data []struct {
			Type      string `json:"type"`
			Title     string `json:"title"`
			StartedAt string `json:"started_at"`
		} `json:"data"`
	}

	err = json.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		log.Printf("Error while parsing TwitchAPI response: %v", err)
		return false, ""
	}

	if len(data.Data) == 0 {
		return false, ""
	}

	return data.Data[0].Type == "live", data.Data[0].Title
}

func checkLiveStreamScheduledEvents(s *discordgo.Session) {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	var twitchUsername string

	for range ticker.C {
		guilds, err := s.UserGuilds(100, "", "")
		if err != nil {
			log.Printf("Error while getting guilds: %v", err)
			return
		}
		for _, guild := range guilds {
			events, err := s.GuildScheduledEvents(guild.ID, false)
			if err != nil {
				fmt.Println("s.GuildScheduledEvents")
			}

			for _, e := range events {
				if !e.Creator.Bot {
					return
				}

				twitchUsername = getTwitchUsernameFromURL(e.EntityMetadata.Location)
				isLive, streamTitle := checkTwitchStreamStatus(twitchUsername)
				if len(streamTitle) > 100 {
					streamTitle = streamTitle[0:90]
				}
				if isLive {
					if e.Name != streamTitle {
						_, err = s.GuildScheduledEventEdit(e.GuildID, e.ID, &discordgo.GuildScheduledEventParams{
							Name: streamTitle,
						})
						if err != nil {
							log.Printf("Error while updating scheduledevent: %v", err)
						}
					}
				}

				if !isLive {
					err := s.GuildScheduledEventDelete(e.GuildID, e.ID)
					if err != nil {
						log.Printf("Error deleting scheduled event: %v", err)
					}
				}
			}
		}
	}
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	initTwitchOAuth2Token()

	discordClient, _ := discordgo.New("Bot " + os.Getenv("TOKEN"))
	discordClient.AddHandler(func(s *discordgo.Session, r *discordgo.Ready) {
		go checkLiveStreamScheduledEvents(s)
		fmt.Println("Bot is ready. Logged in as:", s.State.User.Username)
	})

	var wg sync.WaitGroup

	discordClient.AddHandler(func(s *discordgo.Session, m *discordgo.MessageCreate) {
		//if m.Author.Bot {
		wg.Add(1)
		createLiveStreamScheduledEvent(s, m.Content, m.GuildID, &wg)
		//}
	})

	discordClient.AddHandler(func(s *discordgo.Session, i *discordgo.InteractionCreate) {
		if h, ok := commandHandlers[i.ApplicationCommandData().Name]; ok {
			h(s, i)
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

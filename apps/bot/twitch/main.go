package main

import (
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/joho/godotenv"
)

var (
	twitchClient = twitch.NewClient("", "")

	// TODO: command aliases
	commands = map[string]func(message twitch.PrivateMessage, commandName string, params []string){
		"ping": func(message twitch.PrivateMessage, commandName string, params []string) {
			twitchClient.Say(message.Channel, "pong! VoHiYo")
		},
		"kampus": func(message twitch.PrivateMessage, commandName string, params []string) {
			twitchClient.Say(message.Channel, "https://discord.kamp.us")
		},
		"frontendship": func(message twitch.PrivateMessage, commandName string, params []string) {
			twitchClient.Say(message.Channel, "https://discord.gg/frontendship")
		},
		"fs": func(message twitch.PrivateMessage, commandName string, params []string) {
			twitchClient.Say(message.Channel, "@"+message.User.DisplayName+" Önerebileceğim kaynaklar: https://www.theodinproject.com/paths/full-stack-javascript ve https://fullstackopen.com/en/")
		},
		"lurk": func(message twitch.PrivateMessage, commandName string, params []string) {
			twitchClient.Say(message.Channel, "Teşekkürler! "+message.User.DisplayName)
		},
		"davet": func(message twitch.PrivateMessage, commandName string, params []string) {
			var channel = message.User.Name
			if params[0] == channel {
				twitchClient.Join(channel)
			}
		},
	}
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	twitchClient = twitch.NewClient("senchabot", os.Getenv("OAUTH"))

	twitchClient.OnPrivateMessage(handlePrivateMessage)

	handleBotJoin()

	fmt.Println("CLIENT_CONNECT")
	error := twitchClient.Connect()
	if error != nil {
		panic("error")
	}
}

func handlePrivateMessage(message twitch.PrivateMessage) {
	var splitMsg = strings.Split(message.Message, " ")
	var cmd = strings.Trim(splitMsg[0], " ")
	var params = splitMsg[1:]
	if strings.HasPrefix(cmd, "!") {
		cmd = strings.TrimPrefix(cmd, "!")
		if c, ok := commands[cmd]; ok {
			c(message, cmd, params)
		}
	}
}

func handleBotJoin() {
	channels := []string{"twitch"}
	if len(channels) > 0 {
		for i := 0; i < len(channels); i++ {
			twitchClient.Join(channels[i])
		}
	}
}

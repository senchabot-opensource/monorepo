package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/joho/godotenv"
	"github.com/senchabot-dev/monorepo/apps/bot/twitch/internal"
	"github.com/senchabot-dev/monorepo/apps/bot/twitch/internal/handler"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	twitchClient := twitch.NewClient("senchabot", os.Getenv("OAUTH"))

	client := internal.NewClient(twitchClient)

	handler.InitHandlers(client.Twitch)

	fmt.Println("CLIENT_CONNECT")
	error := twitchClient.Connect()
	if error != nil {
		panic("error")
	}
}

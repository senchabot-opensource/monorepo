package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/joho/godotenv"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/handler"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/service"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	twitchClient := twitch.NewClient("senchabot", os.Getenv("OAUTH"))

	clients := client.NewClients(twitchClient)
	services := service.NewServices()
	handlers := handler.NewHandlers()

	handlers.InitBotEventHandlers(clients, services)

	go func() {
		fmt.Println("Connecting to Twitch...")
		error := twitchClient.Connect()
		if error != nil {
			panic("Connecting to Twitch Error" + error.Error())
		}
	}()

	go func() {
		fmt.Println("Starting HTTP server...")
		mux := http.NewServeMux()
		handlers.InitHttpHandlers(clients, services, mux)

		error := http.ListenAndServe(":8080", mux)
		if error != nil {
			log.Fatal("ListenAndServe Error:", error)
		}
	}()

	select {}
}

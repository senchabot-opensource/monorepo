package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/handler"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/service"
	twsrvc "github.com/senchabot-opensource/monorepo/packages/gosenchabot/service/twitch"
)

func clearDailyCounts() {
	// Clear daily counts at the end of the day
	today := time.Now().Format("2006-01-02")
	for channel := range handler.ChannelSubTypeCount {
		delete(handler.ChannelSubTypeCount[channel], today)
	}
}

func main() {
	twsrvc.InitTwitchOAuth2Token()

	twitchClient := twitch.NewClient(os.Getenv("BOT_USER_NAME"), os.Getenv("OAUTH"))

	clients := client.NewClients(twitchClient)
	services := service.NewServices()
	handlers := handler.NewHandlers(clients, services)

	handlers.InitBotEventHandlers()

	endOfDay := time.Date(time.Now().Year(), time.Now().Month(), time.Now().Day(), 23, 59, 59, 0, time.Now().Location())
	time.AfterFunc(endOfDay.Sub(time.Now()), clearDailyCounts)

	go func() {
		log.Println("Connecting to Twitch...")
		error := twitchClient.Connect()
		if error != nil {
			panic("Connecting to Twitch Error" + error.Error())
		}
	}()

	go func() {
		log.Println("Starting HTTP server...")
		mux := http.NewServeMux()
		handlers.InitHttpHandlers(mux)

		error := http.ListenAndServe(":8080", mux)
		if error != nil {
			log.Fatal("ListenAndServe Error:", error)
		}
	}()

	select {}
}

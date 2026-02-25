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
	"github.com/senchabot-opensource/monorepo/db/postgresql"
	botcommandgrpc "github.com/senchabot-opensource/monorepo/grpc/botcommand/client"
	"github.com/senchabot-opensource/monorepo/twitchapi"
)

func clearDailyCounts() {
	// Clear daily counts at the end of the day
	today := time.Now().Format("2006-01-02")
	for channel := range handler.ChannelSubTypeCount {
		delete(handler.ChannelSubTypeCount[channel], today)
	}
}

func main() {
	log.Println("Starting Twitch Bot...")
	twitchService, err := twitchapi.NewTwitchService(
		os.Getenv("TWITCH_CLIENT_ID"),
		os.Getenv("TWITCH_CLIENT_SECRET"),
		os.Getenv("BOT_USER_ID"),
	)
	if err != nil {
		log.Fatalf("Failed to initialize Twitch service: %v", err)
	}

	botCommandClient, err := botcommandgrpc.NewBotCommandClient(os.Getenv("BOT_COMMAND_GRPC_ADDR"))
	if err != nil {
		log.Fatalf("Failed to initialize BotCommand gRPC client: %v", err)
	}
	log.Printf("BotCommand gRPC client connected to %s", os.Getenv("BOT_COMMAND_GRPC_ADDR"))

	twitchClient := twitch.NewClient(os.Getenv("BOT_USER_NAME"), os.Getenv("OAUTH"))
	clients := client.NewClients(twitchClient)
	database := postgresql.New()
	service := service.New(botCommandClient, twitchService, database)
	handlers := handler.NewHandlers(clients, service, twitchService)

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
		mux := http.NewServeMux()
		handlers.InitHttpHandlers(mux)

		port := "8080"
		if os.Getenv("PORT") != "" {
			port = os.Getenv("PORT")
		}

		log.Println("running http server... :" + port)
		err := http.ListenAndServe(":"+port, mux)
		if err != nil {
			log.Fatal("ListenAndServe Error:", err)
		}
	}()

	select {}
}

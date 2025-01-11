package main

import (
	"log"
	"net/http"
	"os"
	"os/signal"
	"sync"

	_ "time/tzdata"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/command"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/handler"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/pkg/twitchapi"
)

func main() {
	twitchService, err := twitchapi.NewTwitchService(
		os.Getenv("TWITCH_CLIENT_ID"),
		os.Getenv("TWITCH_CLIENT_SECRET"),
		os.Getenv("BOT_USER_ID"),
	)
	if err != nil {
		log.Fatalf("Failed to initialize Twitch service: %v", err)
	}

	discordClient, _ := discordgo.New("Bot " + os.Getenv("TOKEN"))

	var wg sync.WaitGroup

	service := service.New()
	command := command.New(discordClient, service, twitchService)
	handler := handler.New(discordClient, service, twitchService)

	handler.InitBotEventHandlers(command)

	go func() {
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
	}()

	go func() {
		log.Println("Starting HTTP server...")
		mux := http.NewServeMux()
		handler.InitHttpHandlers(mux)

		error := http.ListenAndServe(":8080", mux)
		if error != nil {
			log.Fatal("ListenAndServe Error:", error)
		}
	}()

	select {}
}

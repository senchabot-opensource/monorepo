package main

import (
	"log"
	"os"
	"os/signal"
	"sync"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/handler"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"

	twsrvc "github.com/senchabot-opensource/monorepo/packages/gosenchabot/service/twitch"
)

func main() {
	//dotErr := godotenv.Load()
	//if dotErr != nil {
	//log.Fatal("Error loading .env file", dotErr.Error())
	//}

	token := twsrvc.InitTwitchOAuth2Token()

	discordClient, _ := discordgo.New("Bot " + os.Getenv("TOKEN"))

	var wg sync.WaitGroup

	service := service.New()
	handler := handler.New(discordClient, service)

	handler.InitBotEventHandlers(token)

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

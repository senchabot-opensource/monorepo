package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/joho/godotenv"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/backend/postgresql"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/db"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/handler"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/server"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	twitchClient := twitch.NewClient("senchabot", os.Getenv("OAUTH"))

	postgreSQLBackend := postgresql.NewPostgreSQLBackend(db.NewPostgreSQL())
	server := server.NewSenchabotAPIServer(postgreSQLBackend)

	clients := client.NewClients(twitchClient)

	handler.InitHandlers(clients, server)

	fmt.Println("CLIENT_CONNECT")
	error := twitchClient.Connect()
	if error != nil {
		panic("error" + error.Error())
	}
}

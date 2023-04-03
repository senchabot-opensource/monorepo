package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/joho/godotenv"
	"github.com/senchabot-dev/monorepo/apps/bot/twitch/client"
	"github.com/senchabot-dev/monorepo/apps/bot/twitch/internal/backend/mysql"
	"github.com/senchabot-dev/monorepo/apps/bot/twitch/internal/db"
	"github.com/senchabot-dev/monorepo/apps/bot/twitch/internal/handler"
	"github.com/senchabot-dev/monorepo/apps/bot/twitch/server"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	twitchClient := twitch.NewClient("senchabot", os.Getenv("OAUTH"))

	mySQLBackend := mysql.NewMySQLBackend(db.NewMySQL())
	server := server.NewSenchabotAPIServer(mySQLBackend)

	clients := client.NewClients(twitchClient)

	handler.InitHandlers(clients, server)

	fmt.Println("CLIENT_CONNECT")
	error := twitchClient.Connect()
	if error != nil {
		panic("error")
	}
}

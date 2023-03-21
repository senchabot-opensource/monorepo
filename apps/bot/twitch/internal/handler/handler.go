package handler

import "github.com/gempir/go-twitch-irc/v3"

func InitHandlers(twitchClient *twitch.Client) {

	PrivateMessage(twitchClient)

	BotJoin(twitchClient)
}

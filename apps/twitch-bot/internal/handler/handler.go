package handler

import (
	"net/http"

	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/service"
)

type Handler interface {
	InitBotEventHandlers(client *client.Clients, service service.Services)
	InitHttpHandlers(client *client.Clients, service service.Services, mux *http.ServeMux)
}

type Handlers struct {
	joinedChannelList []string
}

func (b *Handlers) InitBotEventHandlers(client *client.Clients, service service.Services) {
	PrivateMessage(client, service)
	b.joinedChannelList = BotJoin(client, service)
}

func (b *Handlers) InitHttpHandlers(client *client.Clients, service service.Services, mux *http.ServeMux) {
	mux.HandleFunc("/webhook", func(w http.ResponseWriter, r *http.Request) {
		service.Webhook.BotJoin(client, b.joinedChannelList, w, r)
	})
}

func NewHandlers() Handler {
	return &Handlers{}
}

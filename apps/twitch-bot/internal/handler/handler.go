package handler

import (
	"net/http"

	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/service"
)

type Handler interface {
	InitBotEventHandlers()
	InitHttpHandlers(mux *http.ServeMux)
}

type handlers struct {
	joinedChannelList []string
	client            *client.Clients
	service           service.Service
}

func (h *handlers) InitBotEventHandlers() {
	PrivateMessage(h.client, h.service)
	h.joinedChannelList = BotJoin(h.client, h.service)
}

func (h *handlers) InitHttpHandlers(mux *http.ServeMux) {
	mux.HandleFunc("/webhook", func(w http.ResponseWriter, r *http.Request) {
		h.service.BotJoinWebhook(h.client, h.joinedChannelList, w, r)
	})
}

func NewHandlers(client *client.Clients, service service.Service) Handler {
	return &handlers{
		client:  client,
		service: service,
	}
}

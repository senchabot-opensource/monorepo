package handler

import (
	"net/http"

	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/pkg/twitchapi"
)

type Handler interface {
	InitBotEventHandlers()
	InitHttpHandlers(mux *http.ServeMux)
}

type handlers struct {
	joinedChannelList []string
	client            *client.Clients
	service           service.Service
	twitchService     twitchapi.TwitchService
}

func (h *handlers) InitBotEventHandlers() {
	h.PrivateMessage()
	h.joinedChannelList = h.BotJoin()
	h.UserNoticeMessage()
}

func (h *handlers) InitHttpHandlers(mux *http.ServeMux) {
	mux.HandleFunc("/webhook", func(w http.ResponseWriter, r *http.Request) {
		h.service.BotJoinWebhook(h.client, h.joinedChannelList, w, r)
	})
	mux.HandleFunc("/webhook/depart", func(w http.ResponseWriter, r *http.Request) {
		h.service.BotDepartWebhook(h.client, h.joinedChannelList, w, r)
	})
}

func NewHandlers(client *client.Clients, service service.Service, twitchService twitchapi.TwitchService) Handler {
	return &handlers{
		client:        client,
		service:       service,
		twitchService: twitchService,
	}
}

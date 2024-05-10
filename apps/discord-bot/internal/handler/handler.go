package handler

import (
	"net/http"
	"time"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/command"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
)

type Handler interface {
	InitBotEventHandlers(token string)
	InitHttpHandlers(mux *http.ServeMux)
}

type handler struct {
	discordClient *discordgo.Session
	service       service.Service
}

func (h *handler) InitBotEventHandlers(token string) {
	command := command.New(h.discordClient, token, h.service, 2*time.Second)

	h.Ready(token)
	h.GuildCreate()
	h.GuildDelete()
	h.MessageCreate(command)
	h.InteractionCreate(command)
	h.MessageReactionAdd()

	command.DeployCommands(h.discordClient)
}

func (h *handler) InitHttpHandlers(mux *http.ServeMux) {
	mux.HandleFunc("/webhook/leave", func(w http.ResponseWriter, r *http.Request) {
		h.service.BotLeaveWebhook(h.discordClient, w, r)
	})
}

func New(discordClient *discordgo.Session, service service.Service) Handler {
	return &handler{
		discordClient: discordClient,
		service:       service,
	}
}

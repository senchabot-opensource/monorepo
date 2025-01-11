package handler

import (
	"net/http"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/command"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service/streamer"
	"github.com/senchabot-opensource/monorepo/pkg/twitchapi"
)

type Handler interface {
	InitBotEventHandlers(command command.Command)
	InitHttpHandlers(mux *http.ServeMux)
}

type handler struct {
	discordClient   *discordgo.Session
	service         service.Service
	twitchService   twitchapi.TwitchService
	streamerService *streamer.StreamerService
}

func (h *handler) InitBotEventHandlers(command command.Command) {
	h.Ready()
	h.GuildCreate()
	h.GuildDelete()
	h.MessageCreate(command)
	h.InteractionCreate(command)
	h.MessageReactionAdd()
	h.ChannelDelete()
}

func (h *handler) InitHttpHandlers(mux *http.ServeMux) {
	mux.HandleFunc("/webhook/leave", func(w http.ResponseWriter, r *http.Request) {
		h.service.BotLeaveWebhook(h.discordClient, w, r)
	})
}

func New(discordClient *discordgo.Session, service service.Service, twitchService twitchapi.TwitchService) Handler {
	return &handler{
		discordClient:   discordClient,
		service:         service,
		twitchService:   twitchService,
		streamerService: streamer.NewStreamerService(twitchService),
	}
}

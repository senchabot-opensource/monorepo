package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/command"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service/streamer"
	"github.com/senchabot-opensource/monorepo/twitchapi"
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

	mux.HandleFunc("/webhook/livestream/add", h.handleLivestreamAdd)
	mux.HandleFunc("/webhook/livestream/delete", h.handleLivestreamDelete)
}

type livestreamWebhookRequest struct {
	GuildID          string `json:"guild_id"`
	TwitchUserID     string `json:"twitch_user_id"`
	TwitchUsername   string `json:"twitch_username"`
	DiscordChannelID string `json:"channel_id"`
}

func (h *handler) handleLivestreamAdd(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req livestreamWebhookRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.GuildID == "" || req.TwitchUserID == "" || req.TwitchUsername == "" {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	h.streamerService.SetStreamerData(req.GuildID, req.TwitchUserID, req.TwitchUsername, req.DiscordChannelID)
	log.Printf("[LivestreamAdd] Streamer added: guild=%s, twitch=%s", req.GuildID, req.TwitchUsername)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func (h *handler) handleLivestreamDelete(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req livestreamWebhookRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.GuildID == "" || req.TwitchUserID == "" {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	h.streamerService.DeleteStreamerFromData(req.GuildID, req.TwitchUserID)
	log.Printf("[LivestreamDelete] Streamer removed: guild=%s, twitchUserId=%s", req.GuildID, req.TwitchUserID)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func New(discordClient *discordgo.Session, service service.Service, twitchService twitchapi.TwitchService) Handler {
	streamerService := streamer.NewStreamerService(twitchService)
	return &handler{
		discordClient:   discordClient,
		service:         service,
		twitchService:   twitchService,
		streamerService: streamerService,
	}
}

package handler

import (
	"time"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/command"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
)

type Handler interface {
	InitBotEventHandlers(token string)
}

type handlers struct {
	discordClient *discordgo.Session
	service       service.Service
}

func (h *handlers) InitBotEventHandlers(token string) {
	command := command.New(h.discordClient, token, h.service, 2*time.Second)

	h.Ready(token)
	h.GuildCreate()
	h.GuildDelete()
	h.MessageCreate(command)
	h.InteractionCreate(command)
	h.MessageReactionAdd()

	command.DeployCommands(h.discordClient)
}

func NewHandlers(discordClient *discordgo.Session, service service.Service) Handler {
	return &handlers{
		discordClient: discordClient,
		service:       service,
	}
}

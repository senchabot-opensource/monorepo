package command

import (
	"context"
	"log"
	"strings"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
)

func (c *commands) CmdsCommand(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, service service.Service) {
	var commandListArr []string
	var commandListString string

	commandList, err := c.service.GetCommandList(ctx, i.GuildID)
	if err != nil {
		log.Printf("CmdsCommand Error: %v", err)
		return
	}

	if len(commandList) < 1 {
		ephemeralRespond(s, i, "No data.")
		return
	}

	for _, v := range commandList {
		commandListArr = append(commandListArr, v.CommandName)
	}

	commandListString = strings.Join(commandListArr, ", ")

	ephemeralRespond(s, i, "Commands: "+commandListString)
}

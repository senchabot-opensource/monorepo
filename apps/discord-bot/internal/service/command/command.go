package command

import (
	"context"
	"fmt"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service"
)

func RunCommand(s *discordgo.Session, ctx context.Context, service service.Service, cmdName string, m *discordgo.MessageCreate) {
	cmdData, err := service.GetDiscordBotCommand(ctx, cmdName, m.GuildID)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	if cmdData == nil || m.GuildID != cmdData.DiscordServerID {
		return
	}

	s.ChannelMessageSend(m.ChannelID, cmdData.CommandContent)
	service.SaveDiscordBotCommandActivity(ctx, cmdName, m.GuildID, m.Author.Username, m.Author.ID)
}

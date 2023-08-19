package command

import (
	"context"
	"fmt"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/db"
)

func RunCommand(s *discordgo.Session, ctx context.Context, db *db.MySQL, cmdName string, m *discordgo.MessageCreate) {
	cmdData, err := db.GetBotCommand(ctx, cmdName, m.GuildID)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	if cmdData == nil || m.GuildID != cmdData.DiscordServerID {
		return
	}

	s.ChannelMessageSend(m.ChannelID, cmdData.CommandContent)
	db.SaveBotCommandActivity(ctx, cmdName, m.GuildID, m.Author.Username, m.Author.ID)
}

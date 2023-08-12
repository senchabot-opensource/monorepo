package command

import (
	"context"
	"fmt"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/db"
)

func (c *commands) AddCmdCommand(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, db db.MySQL) {
	options := i.ApplicationCommandData().Options

	cmdName := options[0].StringValue()
	cmdContent := options[1].StringValue()

	resp, err := db.CreateBotCommand(ctx, cmdName, cmdContent, i.GuildID, i.Member.User.Username)
	if err != nil {
		fmt.Println(err)
		return
	}

	if resp != nil {
		ephemeralRespond(s, i, *resp)
		return
	}

	ephemeralRespond(s, i, "New Command Added: "+cmdName)
}

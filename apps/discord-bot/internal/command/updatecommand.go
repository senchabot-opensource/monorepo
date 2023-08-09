package command

import (
	"context"
	"fmt"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/db"
)

func (c *commands) UpdateCommand(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, db db.MySQL) {
	options := i.ApplicationCommandData().Options

	switch options[0].Name {
	case "command":
		options = options[0].Options
		cmdName := options[0].StringValue()
		cmdContent := options[1].StringValue()

		updatedCmdName, resp, err := db.UpdateBotCommand(ctx, cmdName, cmdContent, i.GuildID, i.Member.User.Username)
		if err != nil {
			fmt.Println(err)
			return
		}

		if resp != nil {
			ephemeralRespond(s, i, *resp)
			return
		}

		ephemeralRespond(s, i, "Command Updated: "+*updatedCmdName)
	}
}

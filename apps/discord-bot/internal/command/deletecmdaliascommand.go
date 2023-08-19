package command

import (
	"context"
	"fmt"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/db"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot"
)

func (c *commands) DeleteCmdAliasCommand(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, db db.MySQL) {
	options := i.ApplicationCommandData().Options

	cmdName := options[0].StringValue()
	cmdName = gosenchabot.GetProcessedCommandName(cmdName)

	infoText, err := db.DeleteCommandAlias(ctx, cmdName, i.GuildID)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	if infoText != nil {
		ephemeralRespond(s, i, i.Member.User.Username+", "+*infoText)
		return
	}

	fmt.Println("COMMAND_ALIAS_DELETE: command_alias:", cmdName)

	ephemeralRespond(s, i, "Command Alias Deleted: "+cmdName)
}

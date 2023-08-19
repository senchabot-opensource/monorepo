package command

import (
	"context"
	"fmt"
	"strings"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/db"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot"
)

func (c *commands) DeleteCmdAliasCommand(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate, db db.MySQL) {
	options := i.ApplicationCommandData().Options

	cmdName := options[0].StringValue()

	var command_alias = strings.ToLower(cmdName)

	command_alias = gosenchabot.TrimExclamationPrefix(command_alias)

	infoText, err := db.DeleteCommandAlias(ctx, command_alias, i.GuildID)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	if infoText != nil {
		ephemeralRespond(s, i, i.Member.User.Username+", "+*infoText)
		return
	}

	fmt.Println("COMMAND_ALIAS_DELETE: command_alias:", command_alias)

	ephemeralRespond(s, i, "Command Alias Deleted: "+command_alias)
}

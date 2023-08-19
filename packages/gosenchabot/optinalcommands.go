package gosenchabot

import "github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"

func GetOptionalCommands() []models.BotCommand {
	var commands []models.BotCommand

	commands = append(commands, models.BotCommand{CommandName: "lurk", CommandContent: "Teşekkürler! {user_name}"})

	return commands
}

package helper

import "github.com/senchabot-opensource/monorepo/model"

func GetOptionalCommands() []model.BotCommand {
	var commands []model.BotCommand

	commands = append(commands, model.BotCommand{CommandName: "lurk", CommandContent: "Teşekkürler! {user_name}"})

	return commands
}

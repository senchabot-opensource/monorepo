package models

import "github.com/google/uuid"

type TwitchChannel struct {
	ID          uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	ChannelId   string    `gorm:"column:channel_id"`
	ChannelName string    `gorm:"column:channel_name"`
	UserId      *string   `gorm:"column:user_id"`
}

type BotCommand struct {
	ID              int
	CommandName     string `gorm:"column:command_name"`
	CommandContent  string `gorm:"column:command_content"`
	TwitchChannelID string `gorm:"column:twitch_channel_id"`
	DiscordServerID string `gorm:"column:discord_server_id"`
}

func GetOptionalCommands() []BotCommand {
	var commands []BotCommand

	commands = append(commands, BotCommand{CommandName: "lurk", CommandContent: "Teşekkürler! {user_name}"})

	return commands
}

package config

var (
	ErrorMessage = "An error occurred. Error code: "

	AddCommandInfo         = "For example: !acmd [command_name] [command_content]"
	AddCommandAliasInfo    = "For example: !acmda [command_name] [command_alias(es) separated by space]"
	DeleteCommandInfo      = "For example: !dcmd [command_name]"
	DeleteCommandAliasInfo = "For example: !dcmda [command_alias]"
	UpdateCommandInfo      = "For example: !ucmd [command_name] [new_command_content]"

	InviteCommandInfo = "!invite [your_channel_name]"
	SoCommandInfo     = "For example: !so [username]"
	SozlukCommandInfo = "For example: !sozluk [term-name]"

	CannotExecuteCommand = " cannot execute the command"
	CommandContentLimit  = "Command content is too long. Maximum length is 400 characters."

	MIN_CMD_TIMER_INTERVAL = 25
)

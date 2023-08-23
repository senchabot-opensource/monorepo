package models

import "time"

type TwitchChannel struct {
	ID          int
	ChannelId   string  `gorm:"column:channel_id"`
	ChannelName string  `gorm:"column:channel_name"`
	UserId      *string `gorm:"column:user_id"`
}

type WebhookData struct {
	Token    string `json:"token"`
	Event    string `json:"event"`
	UserName string `json:"user_name"`
}

type TwitchBotConfig struct {
	ID              int
	Key             string `gorm:"column:config_key"`
	Value           string `gorm:"column:config_value"`
	TwitchChannelID string `gorm:"column:twitch_channel_id"`
}

type BotActionActivity struct {
	ID               int
	BotPlatformType  string  `gorm:"column:bot_platform_type"`
	BotActivity      string  `gorm:"column:bot_activity"`
	DiscordServerID  *string `gorm:"column:discord_server_id"`
	TwitchChannelID  *string `gorm:"column:twitch_channel_id"`
	ActivityAuthor   *string `gorm:"column:activity_author"`
	ActivityAuthorID *string `gorm:"column:activity_author_id"`
}

type CommandResponse struct {
	Message string
}

type BotCommand struct {
	ID              int
	CommandName     string     `gorm:"column:command_name"`
	CommandContent  string     `gorm:"column:command_content"`
	TwitchChannelID string     `gorm:"column:twitch_channel_id"`
	DiscordServerID string     `gorm:"column:discord_server_id"`
	CommandType     int        `gorm:"column:command_type"`
	Status          int        `gorm:"column:status"`
	CreatedBy       *string    `gorm:"column:created_by"`
	UpdatedBy       *string    `gorm:"column:updated_by"`
	CreatedAt       *time.Time `gorm:"column:created_at"`
}

type BotCommandAlias struct {
	ID              int
	CommandAlias    string     `gorm:"column:command_alias"`
	CommandName     string     `gorm:"column:command_name"`
	TwitchChannelID *string    `gorm:"column:twitch_channel_id"`
	DiscordServerID *string    `gorm:"column:discord_server_id"`
	Status          int        `gorm:"column:status"`
	CreatedBy       string     `gorm:"column:created_by"`
	CreatedAt       *time.Time `gorm:"column:created_at"`
}
type DiscordBotConfigs struct {
	ID       int
	Key      string `gorm:"column:config_key"`
	Value    string `gorm:"column:config_value"`
	ServerID string `gorm:"column:server_id"`
}

type DiscordAnnouncementChannels struct {
	ID        int
	ChannelID string     `gorm:"column:channel_id"`
	ServerID  string     `gorm:"column:server_id"`
	CreatedBy string     `gorm:"column:created_by"`
	CreatedAt *time.Time `gorm:"column:created_at"`
}

type DiscordTwitchLiveAnnos struct {
	ID             int
	TwitchUsername string     `gorm:"column:twitch_username"`
	TwitchUserID   string     `gorm:"column:twitch_user_id"`
	AnnoChannelID  string     `gorm:"column:anno_channel_id"`
	AnnoServerID   string     `gorm:"column:anno_server_id"`
	AnnoContent    *string    `gorm:"column:anno_content"`
	LastAnnoDate   *time.Time `gorm:"column:last_anno_date"`
	Type           int        `gorm:"column:type"`
	CreatedBy      string     `gorm:"column:created_by"`
	CreatedAt      *time.Time `gorm:"column:created_at"`
}

type DiscordServer struct {
	ServerID    string `gorm:"column:server_id"`
	ServerName  string `gorm:"column:server_name"`
	ServerOwner string `gorm:"column:server_owner"`
}

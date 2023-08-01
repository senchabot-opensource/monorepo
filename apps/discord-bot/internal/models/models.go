package models

import "time"

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

type BotActionActivity struct {
	ID               int
	BotPlatformType  string  `gorm:"column:bot_platform_type"`
	BotActivity      string  `gorm:"column:bot_activity"`
	DiscordServerID  *string `gorm:"column:discord_server_id"`
	TwitchChannelID  *string `gorm:"column:twitch_channel_id"`
	ActivityAuthor   *string `gorm:"column:activity_author"`
	ActivityAuthorID *string `gorm:"column:activity_author_id"`
}

type DiscordServer struct {
	ServerID    string `gorm:"column:server_id"`
	ServerName  string `gorm:"column:server_name"`
	ServerOwner string `gorm:"column:server_owner"`
}

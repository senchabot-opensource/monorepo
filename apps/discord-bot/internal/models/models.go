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
	Type           int        `gorm:"column:type"`
	CreatedBy      string     `gorm:"column:created_by"`
	CreatedAt      *time.Time `gorm:"column:created_at"`
}

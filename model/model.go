package model

import (
	"time"

	"github.com/senchabot-opensource/monorepo/platform"
)

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
	BotPlatformType  platform.Platform `gorm:"column:bot_platform_type"`
	BotPlatformID    *string           `gorm:"column:bot_platform_id"`
	BotActivity      string            `gorm:"column:bot_activity"`
	ActivityAuthor   *string           `gorm:"column:activity_author"`
	ActivityAuthorID *string           `gorm:"column:activity_author_id"`
}

type CommandResponse struct {
	Message string
}

type BotCommand struct {
	ID              int
	CommandName     string     `gorm:"column:command_name"`
	CommandContent  string     `gorm:"column:command_content"`
	TwitchChannelID *string    `gorm:"column:twitch_channel_id"`
	DiscordServerID *string    `gorm:"column:discord_server_id"`
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

type DiscordChannelTwitchCategoryFilter struct {
	ID                  int
	AnnoServerID        string     `gorm:"column:anno_server_id"`
	AnnoChannelID       string     `gorm:"column:anno_channel_id"`
	CategoryFilterRegex string     `gorm:"column:category_filter_regex"`
	ConditionType       uint       `gorm:"column:condition_type"`
	CreatedBy           string     `gorm:"column:created_by"`
	CreatedAt           *time.Time `gorm:"column:created_at"`
}

type DiscordServer struct {
	ServerID    string `gorm:"column:server_id"`
	ServerName  string `gorm:"column:server_name"`
	ServerOwner string `gorm:"column:server_owner"`
}

type TwitchUserInfo struct {
	ID              string `json:"id"`
	Login           string `json:"login"`
	DisplayName     string `json:"display_name"`
	BroadcasterType string `json:"broadcaster_type"`
	Description     string `json:"description"`
	ProfileImageURL string `json:"profile_image_url"`
	CreatedAt       string `json:"created_at"`
}

type TwitchStreamerData struct {
	UserID       string   `json:"user_id"`
	UserLogin    string   `json:"user_login"`
	UserName     string   `json:"user_name"`
	GameName     string   `json:"game_name"`
	Type         string   `json:"type"`
	Title        string   `json:"title"`
	Tags         []string `json:"tags"`
	ViewerCount  int      `json:"viewer_count"`
	StartedAt    string   `json:"started_at"`
	Language     string   `json:"language"`
	ThumbnailURL string   `json:"thumbnail_url"`
}

type BotCommandStatistic struct {
	BotPlatformType platform.Platform `gorm:"column:bot_platform_type"`
	CommandName     string            `gorm:"column:command_name"`
	Count           int               `gorm:"column:count"`
}

type CommandVariable struct {
	CommandContent   string
	UserName         string
	CurrentDate      *time.Time
	CommandCreatedAt *time.Time
	ChannelName      string
	BotPlatform      platform.Platform
	BotPlatformID    string
}

type MessageData struct {
	PlatformEntityID string
	UserName         string
	ChannelName      string
}

type CommandTimer struct {
	ID            int
	BotPlatform   platform.Platform `gorm:"column:bot_platform"`
	BotPlatformID string            `gorm:"column:bot_platform_id"`
	CommandName   string            `gorm:"column:command_name"`
	Interval      int               `gorm:"column:interval"`
	Status        int               `gorm:"column:status"`
}

type BotCommandVariable struct {
	ID              int
	VariableName    string            `gorm:"column:variable_name"`
	VariableContent string            `gorm:"column:variable_content"`
	BotPlatform     platform.Platform `gorm:"column:bot_platform"`
	BotPlatformID   string            `gorm:"column:bot_platform_id"`
	Status          Status            `gorm:"column:status"`
	CreatedBy       string            `gorm:"column:created_by"`
	UpdatedBy       *string           `gorm:"column:updated_by"`
	CreatedAt       *time.Time        `gorm:"column:created_at"`
	UpdatedAt       *time.Time        `gorm:"column:updated_at"`
}

type Status int

const (
	BotCommandVariableStatusInactive Status = iota
	BotCommandVariableStatusActive
)

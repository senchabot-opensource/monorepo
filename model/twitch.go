package model

import "time"

type TwitchCommunity struct {
	ID               uint   `gorm:"primaryKey"`
	CommunityName    string `gorm:"index"`
	CreatorChannelID string
	CreatedAt        time.Time
	UpdatedAt        time.Time
}

type TwitchCommunityMember struct {
	ID              uint `gorm:"primaryKey"`
	CommunityID     uint
	MemberChannelID string
	CreatedAt       time.Time
	UpdatedAt       time.Time
}

type TwitchCommunitySubscription struct {
	ID          uint `gorm:"primaryKey"`
	CommunityID uint `gorm:"index"`
	ChannelID   string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

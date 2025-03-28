package postgresql

import (
	"context"
	"errors"
	"log"

	"github.com/senchabot-opensource/monorepo/model"
	"github.com/senchabot-opensource/monorepo/platform"
	"gorm.io/gorm"
)

func (m *postgresql) GetTwitchChannels(ctx context.Context) ([]*model.TwitchChannel, error) {
	var twitchChannels []*model.TwitchChannel

	result := m.DB.Find(&twitchChannels)
	if result.Error != nil {
		return nil, errors.New("(GetTwitchChannels) db.Find Error:" + result.Error.Error())
	}

	return twitchChannels, nil
}

func (m *postgresql) CreateTwitchChannel(ctx context.Context, channelId string, channelName string, userId *string) (bool, error) {
	var twitchChannel []model.TwitchChannel

	result := m.DB.Where("channel_id = ?", channelId).Where("channel_name = ?", channelName).Find(&twitchChannel)
	if result.Error != nil {
		return false, errors.New("(CreateTwitchChannel) db.Find Error:" + result.Error.Error())
	}
	if len(twitchChannel) > 0 {
		return true, nil
	}

	twitchChannel = append(twitchChannel, model.TwitchChannel{
		ChannelId:   channelId,
		ChannelName: channelName,
		UserId:      nil,
	})

	result = m.DB.Create(&twitchChannel)
	if result.Error != nil {
		return false, errors.New("(CreateTwitchChannel) db.Exec Error:" + result.Error.Error())
	}

	return false, nil
}

func (m *postgresql) DeleteTwitchChannel(ctx context.Context, channelId string, userId *string) (bool, error) {
	var twitchChannel *model.TwitchChannel

	result := m.DB.Where("channel_id = ?", channelId).Delete(&twitchChannel)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return false, gorm.ErrRecordNotFound
		}
		return false, errors.New("(DeleteTwitchChannel) db.Delete Error:" + result.Error.Error())
	}

	return true, nil
}

func (m *postgresql) GetTwitchBotConfig(ctx context.Context, twitchChannelId string, configKey string) (*model.TwitchBotConfig, error) {
	var twitchBotConfig model.TwitchBotConfig
	result := m.DB.Where("twitch_channel_id = ?", twitchChannelId).Where("config_key = ?", configKey).First(&twitchBotConfig)

	if result.Error != nil {
		return nil, errors.New("(GetTwitchBotConfig) db.First Error:" + result.Error.Error())
	}

	return &twitchBotConfig, nil
}

func (m *postgresql) CheckTwitchBotConfig(ctx context.Context, twitchChannelId string, configKey string, configValue string) bool {
	configData, err := m.GetTwitchBotConfig(ctx, twitchChannelId, configKey)
	if err != nil {
		log.Println("[postgresql.CheckTwitchBotConfig] GetTwitchBotConfig error:", err.Error())
		return false
	}

	if configData != nil && configData.Value == configValue {
		return true
	}

	return false
}

func (m *postgresql) SaveTwitchBotCommandActivity(context context.Context, commandName string, twitchChannelId string, commandAuthor, commandAuthorId string) {
	check := m.CheckTwitchBotConfig(context, twitchChannelId, "bot_activity_enabled", "1")
	if !check {
		return
	}

	commandName = "!" + commandName

	if err := m.CreateBotActionActivity(context, platform.TWITCH, commandName, twitchChannelId, commandAuthor, commandAuthorId); err != nil {
		log.Println("[postgresql.SaveTwitchBotCommandActivity] CreateBotActionActivity error:", err.Error())
	}
}

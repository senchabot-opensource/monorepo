package mysql

import (
	"context"
	"errors"

	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/backend"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/models"
	"gorm.io/gorm"
)

type MySQLBackend struct {
	DB *gorm.DB
}

func NewMySQLBackend(db *gorm.DB) backend.Backend {
	return &MySQLBackend{
		DB: db,
	}
}

func (b *MySQLBackend) GetTwitchChannels(ctx context.Context) ([]*models.TwitchChannel, error) {
	var twitchChannels []*models.TwitchChannel

	result := b.DB.Find(&twitchChannels)
	if result.Error != nil {
		return nil, errors.New("(GetTwitchChannels) db.Find Error:" + result.Error.Error())
	}

	return twitchChannels, nil
}

func (b *MySQLBackend) CreateTwitchChannel(ctx context.Context, channelId string, channelName string, userId *string) (bool, error) {
	var twitchChannel []models.TwitchChannel

	result := b.DB.Where("channel_id = ?", channelId).Where("channel_name = ?", channelName).Find(&twitchChannel)
	if result.Error != nil {
		return false, errors.New("(CreateTwitchChannel) db.Find Error:" + result.Error.Error())
	}
	if len(twitchChannel) > 0 {
		return true, nil
	}

	twitchChannel = append(twitchChannel, models.TwitchChannel{
		ChannelId:   channelId,
		ChannelName: channelName,
		UserId:      nil,
	})

	result = b.DB.Create(&twitchChannel)
	if result.Error != nil {
		return false, errors.New("(CreateTwitchChannel) db.Exec Error:" + result.Error.Error())
	}

	return false, nil
}

func (b *MySQLBackend) GetTwitchBotConfig(ctx context.Context, twitchChannelId string, configName string) (*models.TwitchBotConfig, error) {
	var twitchBotConfig models.TwitchBotConfig
	result := b.DB.Where("twitch_channel_id = ?", twitchChannelId).Where("config_name = ?", configName).First(&twitchBotConfig)

	if result.Error != nil {
		return nil, errors.New("(GetTwitchBotConfig) db.First Error:" + result.Error.Error())
	}

	return &twitchBotConfig, nil
}

func (b *MySQLBackend) GetBotCommand(ctx context.Context, commandName string, twitchChannelId string) (*models.BotCommand, error) {
	var botCommand models.BotCommand

	result := b.DB.Where("command_name = ?", commandName).Where("twitch_channel_id = ?", twitchChannelId).First(&botCommand)
	if result.Error != nil {
		return nil, errors.New("(GetBotCommand) db.First Error:" + result.Error.Error())
	}

	return &botCommand, nil
}

func (b *MySQLBackend) CreateBotCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string) (bool, error) {
	var botCommand []models.BotCommand

	result := b.DB.Where("command_name = ?", commandName).Where("twitch_channel_id", twitchChannelId).Find(&botCommand)
	if result.Error != nil {
		return false, errors.New("(CreateBotCommand) db.Find Error:" + result.Error.Error())
	}
	if len(botCommand) > 0 {
		return true, nil
	}

	botCommand = append(botCommand, models.BotCommand{
		CommandName:     commandName,
		CommandContent:  commandContent,
		TwitchChannelID: twitchChannelId,
	})

	result = b.DB.Create(&botCommand)
	if result.Error != nil {
		return false, errors.New("(CreateBotCommand) db.Create Error:" + result.Error.Error())
	}

	return false, nil
}

func (b *MySQLBackend) UpdateBotCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string) error {
	var botCommand *models.BotCommand

	result := b.DB.Where("command_name = ?", commandName).Where("twitch_channel_id = ?", twitchChannelId).First(&botCommand)
	if result.Error != nil {
		return errors.New("(UpdateBotCommand) db.Find Error:" + result.Error.Error())
	}

	result = b.DB.Model(&botCommand).Updates(models.BotCommand{
		CommandContent: commandContent,
	})
	if result.Error != nil {
		return errors.New("(UpdateBotCommand) db.Update Error:" + result.Error.Error())
	}

	return nil
}

func (b *MySQLBackend) DeleteBotCommand(ctx context.Context, commandName string, twitchChannelId string) error {
	var botCommand *models.BotCommand

	result := b.DB.Where("command_name = ?", commandName).Where("twitch_channel_id = ?", twitchChannelId).First(&botCommand)
	if result.Error != nil {
		return errors.New("(DeleteBotCommand) db.First Error:" + result.Error.Error())
	}

	result = b.DB.Delete(&botCommand)
	if result.Error != nil {
		return errors.New("(DeleteBotCommand) db.Delete Error:" + result.Error.Error())
	}

	return nil
}

func (b *MySQLBackend) CreateBotActionActivity(ctx context.Context, botPlatformType string, botActivity string, twitchChannelId string, commandAuthor string) error {
	botActionActivity := models.BotActionActivity{
		BotPlatformType: botPlatformType,
		BotActivity:     botActivity,
		TwitchChannelID: &twitchChannelId,
		CommandAuthor:   &commandAuthor,
	}

	result := b.DB.Create(&botActionActivity)

	if result.Error != nil {
		return errors.New("(CreateBotActionActivity) db.Create Error:" + result.Error.Error())
	}

	return nil
}

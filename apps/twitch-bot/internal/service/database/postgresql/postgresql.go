package postgresql

import (
	"context"
	"errors"
	"fmt"
	"os"

	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/models"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/service/database"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type PostgreSQL struct {
	DB *gorm.DB
}

func NewPostgreSQL() database.Database {
	dsn := os.Getenv("DATABASE_URL")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{Logger: logger.Default.LogMode(logger.Info)})

	if err != nil {
		panic("failed to connect database")
	}
	return &PostgreSQL{
		DB: db,
	}
}

func (b *PostgreSQL) GetTwitchChannels(ctx context.Context) ([]*models.TwitchChannel, error) {
	var twitchChannels []*models.TwitchChannel

	result := b.DB.Find(&twitchChannels)
	if result.Error != nil {
		return nil, errors.New("(GetTwitchChannels) db.Find Error:" + result.Error.Error())
	}

	return twitchChannels, nil
}

func (b *PostgreSQL) CreateTwitchChannel(ctx context.Context, channelId string, channelName string, userId *string) (bool, error) {
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

func (b *PostgreSQL) GetTwitchBotConfig(ctx context.Context, twitchChannelId string, configKey string) (*models.TwitchBotConfig, error) {
	var twitchBotConfig models.TwitchBotConfig
	result := b.DB.Where("twitch_channel_id = ?", twitchChannelId).Where("config_key = ?", configKey).First(&twitchBotConfig)

	if result.Error != nil {
		return nil, errors.New("(GetTwitchBotConfig) db.First Error:" + result.Error.Error())
	}

	return &twitchBotConfig, nil
}

func (b *PostgreSQL) CheckConfig(ctx context.Context, twitchChannelId string, configKey string, configValue string) bool {
	configData, err := b.GetTwitchBotConfig(ctx, twitchChannelId, configKey)
	if err != nil {
		fmt.Println(err.Error())
		return false
	}

	if configData != nil && configData.Value == configValue {
		return true
	}

	return false
}

func (b *PostgreSQL) GetBotCommand(ctx context.Context, commandName string, twitchChannelId string) (*models.BotCommand, error) {
	var botCommand models.BotCommand

	result := b.DB.Where("command_name = ?", commandName).Where("twitch_channel_id = ?", twitchChannelId).First(&botCommand)
	if result.Error != nil {
		return nil, errors.New("(GetBotCommand) db.First Error:" + result.Error.Error())
	}

	return &botCommand, nil
}

func (b *PostgreSQL) CreateBotCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string, createdBy string) (*string, error) {
	var botCommand []models.BotCommand
	var infoText string

	existCommandName, err := b.CheckCommandExists(ctx, commandName, twitchChannelId)
	if err != nil {
		return nil, err
	}
	if existCommandName != nil {
		infoText = "the command \"" + *existCommandName + "\" is already in use"
		return &infoText, nil
	}

	existAliasName, err := b.CheckCommandAliasExist(ctx, commandName, twitchChannelId)
	if err != nil {
		return nil, err
	}
	if existAliasName != nil {
		infoText = "the command \"" + *existAliasName + "\" is already being used as command alias"
		return &infoText, nil
	}

	botCommand = append(botCommand, models.BotCommand{
		CommandName:     commandName,
		CommandContent:  commandContent,
		TwitchChannelID: twitchChannelId,
		CreatedBy:       &createdBy,
	})

	result := b.DB.Create(&botCommand)
	if result.Error != nil {
		return nil, errors.New("(CreateBotCommand) db.Create Error:" + result.Error.Error())
	}

	return nil, nil
}

func (b *PostgreSQL) CheckCommandExists(ctx context.Context, commandName string, twitchChannelId string) (*string, error) {
	var botCommand []models.BotCommand

	result := b.DB.Where("command_name = ?", commandName).Where("twitch_channel_id", twitchChannelId).Find(&botCommand)
	if result.Error != nil {
		return nil, errors.New("(CheckCommandExists) db.Find Error:" + result.Error.Error())
	}
	if len(botCommand) > 0 {
		return &botCommand[0].CommandName, nil
	}

	return nil, nil
}

func (b *PostgreSQL) UpdateBotCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string, updatedBy string) (*string, *string, error) {
	var botCommand *models.BotCommand

	command, _ := b.GetCommandAlias(ctx, commandName, twitchChannelId)
	if command != nil {
		commandName = *command
	}

	existCommandName, err := b.CheckCommandExists(ctx, commandName, twitchChannelId)
	if err != nil {
		return nil, nil, err
	}
	if existCommandName == nil {
		var infoText = "the command \"" + commandName + "\" does not exist"
		return nil, &infoText, nil
	}

	result := b.DB.Where("command_name = ?", commandName).Where("twitch_channel_id = ?", twitchChannelId).First(&botCommand)
	if result.Error != nil {
		return nil, nil, errors.New("(UpdateBotCommand) db.Find Error:" + result.Error.Error())
	}

	result = b.DB.Model(&botCommand).Updates(models.BotCommand{
		CommandContent: commandContent,
		UpdatedBy:      &updatedBy,
	})
	if result.Error != nil {
		return nil, nil, errors.New("(UpdateBotCommand) db.Update Error:" + result.Error.Error())
	}

	return &commandName, nil, nil
}

func (b *PostgreSQL) DeleteBotCommand(ctx context.Context, commandName string, twitchChannelId string) (*string, *string, error) {
	var botCommand *models.BotCommand
	var botCommandAlias *models.BotCommandAlias

	command, _ := b.GetCommandAlias(ctx, commandName, twitchChannelId)
	if command != nil {
		commandName = *command
	}

	existCommandName, err := b.CheckCommandExists(ctx, commandName, twitchChannelId)
	if err != nil {
		return nil, nil, err
	}
	if existCommandName == nil {
		var infoText = "the command \"" + commandName + "\" does not exist"
		return nil, &infoText, nil
	}

	aliasDelete := b.DB.Where("command_name = ?", commandName).Where("twitch_channel_id = ?", twitchChannelId).Delete(&botCommandAlias)
	if aliasDelete.Error != nil {
		return nil, nil, errors.New("(DeleteBotCommand) botCommandAlias db.AliasDelete Error: " + aliasDelete.Error.Error())
	}

	result := b.DB.Where("command_name = ?", commandName).Where("twitch_channel_id = ?", twitchChannelId).First(&botCommand)
	if result.Error != nil {
		return nil, nil, errors.New("(DeleteBotCommand) botCommand db.First Error:" + result.Error.Error())
	}

	result = b.DB.Delete(&botCommand)
	if result.Error != nil {
		return nil, nil, errors.New("(DeleteBotCommand) botCommand db.Delete Error:" + result.Error.Error())
	}

	return &commandName, nil, nil
}

func (b *PostgreSQL) CreateBotActionActivity(ctx context.Context, botPlatformType string, botActivity string, twitchChannelId string, activityAuthor string) error {
	botActionActivity := models.BotActionActivity{
		BotPlatformType: botPlatformType,
		BotActivity:     botActivity,
		TwitchChannelID: &twitchChannelId,
		ActivityAuthor:  &activityAuthor,
	}

	result := b.DB.Create(&botActionActivity)

	if result.Error != nil {
		return errors.New("(CreateBotActionActivity) db.Create Error:" + result.Error.Error())
	}

	return nil
}

func (b *PostgreSQL) SaveBotCommandActivity(context context.Context, commandName string, twitchChannelId string, commandAuthor string) {
	check := b.CheckConfig(context, twitchChannelId, "bot_activity_enabled", "1")
	if !check {
		return
	}

	commandName = "!" + commandName

	if err := b.CreateBotActionActivity(context, "twitch", commandName, twitchChannelId, commandAuthor); err != nil {
		fmt.Println(err.Error())
	}
}

func (b *PostgreSQL) CreateCommandAliases(ctx context.Context, commandName string, aliases []string, twitchChannelId string, createdBy string) (*string, error) {
	commandAliases := []models.BotCommandAlias{}
	var infoText string

	command, _ := b.GetCommandAlias(ctx, commandName, twitchChannelId)
	if command != nil {
		commandName = *command
	}

	// Check command exists
	commandExist, _ := b.CheckCommandExists(ctx, commandName, twitchChannelId)
	if commandExist == nil {
		infoText = "the command \"" + commandName + "\" does not exist"
		return &infoText, nil
	}

	for _, aliasCommandName := range aliases {
		existAlias, err := b.CheckCommandAliasExist(ctx, aliasCommandName, twitchChannelId)
		if err != nil {
			return nil, err
		}
		if existAlias != nil {
			infoText = "the command alias \"" + *existAlias + "\" already exists"
			return &infoText, nil
		}

		commandExist, _ := b.CheckCommandExists(ctx, aliasCommandName, twitchChannelId)
		if commandExist != nil {
			infoText = "the command \"" + aliasCommandName + "\" is already being used as command"
			return &infoText, nil
		}

		if aliasCommandName == commandName {
			infoText = "you cannot use the same name in command and command alias"
			return &infoText, nil
		}

		commandAlias := models.BotCommandAlias{
			CommandAlias:    aliasCommandName,
			CommandName:     commandName,
			TwitchChannelID: &twitchChannelId,
			CreatedBy:       createdBy,
		}
		commandAliases = append(commandAliases, commandAlias)
	}

	err := b.DB.Save(&commandAliases).Error
	if err != nil {
		return nil, errors.New("(CreateCommandAliases) db.Save Error:" + err.Error())
	}

	return nil, nil
}

func (b *PostgreSQL) GetCommandAlias(ctx context.Context, command string, twitchChannelId string) (*string, error) {
	var commandAlias models.BotCommandAlias

	err := b.DB.Where("command_alias = ?", command).Where("twitch_channel_id = ?", twitchChannelId).First(&commandAlias).Error
	if err != nil {
		return nil, errors.New("(GetCommandAlias) db.Find Error:" + err.Error())
	}

	return &commandAlias.CommandName, nil
}

func (b *PostgreSQL) CheckCommandAliasExist(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error) {
	var commandAliasModel []models.BotCommandAlias

	result := b.DB.Where("command_alias = ?", commandAlias).Where("twitch_channel_id", twitchChannelId).Find(&commandAliasModel)
	if result.Error != nil {
		return nil, errors.New("(CheckCommandAlias) db.Find Error:" + result.Error.Error())
	}

	if len(commandAliasModel) > 0 {
		return &commandAliasModel[0].CommandAlias, nil
	}

	return nil, nil
}

func (b *PostgreSQL) DeleteCommandAlias(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error) {
	var commandAliasModel *models.BotCommandAlias

	existAlias, err := b.CheckCommandAliasExist(ctx, commandAlias, twitchChannelId)
	if err != nil {
		return nil, err
	}

	if existAlias == nil {
		var infoText = "the command alias \"" + commandAlias + "\" des not exist"
		return &infoText, nil
	}

	result := b.DB.Where("command_alias = ?", commandAlias).Where("twitch_channel_id = ?", twitchChannelId).First(&commandAliasModel)
	if result.Error != nil {
		return nil, errors.New("(DeleteCommandAlias) db.First Error:" + result.Error.Error())
	}

	result = b.DB.Delete(&commandAliasModel)
	if result.Error != nil {
		return nil, errors.New("(DeleteCommandAlias) db.Delete Error:" + result.Error.Error())
	}

	return nil, nil
}

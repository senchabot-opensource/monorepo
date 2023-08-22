package mysql

import (
	"context"
	"errors"
	"fmt"
	"os"

	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/internal/service/database"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type MySQL struct {
	DB *gorm.DB
}

func NewMySQL() database.Database {
	dsn := os.Getenv("DATABASE_URL")
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{Logger: logger.Default.LogMode(logger.Silent)})

	if err != nil {
		panic("failed to connect database")
	}
	return &MySQL{
		DB: db,
	}
}

func (m *MySQL) GetTwitchChannels(ctx context.Context) ([]*models.TwitchChannel, error) {
	var twitchChannels []*models.TwitchChannel

	result := m.DB.Find(&twitchChannels)
	if result.Error != nil {
		return nil, errors.New("(GetTwitchChannels) db.Find Error:" + result.Error.Error())
	}

	return twitchChannels, nil
}

func (m *MySQL) CreateTwitchChannel(ctx context.Context, channelId string, channelName string, userId *string) (bool, error) {
	var twitchChannel []models.TwitchChannel

	result := m.DB.Where("channel_id = ?", channelId).Where("channel_name = ?", channelName).Find(&twitchChannel)
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

	result = m.DB.Create(&twitchChannel)
	if result.Error != nil {
		return false, errors.New("(CreateTwitchChannel) db.Exec Error:" + result.Error.Error())
	}

	return false, nil
}

func (m *MySQL) GetTwitchBotConfig(ctx context.Context, twitchChannelId string, configKey string) (*models.TwitchBotConfig, error) {
	var twitchBotConfig models.TwitchBotConfig
	result := m.DB.Where("twitch_channel_id = ?", twitchChannelId).Where("config_key = ?", configKey).First(&twitchBotConfig)

	if result.Error != nil {
		return nil, errors.New("(GetTwitchBotConfig) db.First Error:" + result.Error.Error())
	}

	return &twitchBotConfig, nil
}

func (m *MySQL) CheckConfig(ctx context.Context, twitchChannelId string, configKey string, configValue string) bool {
	configData, err := m.GetTwitchBotConfig(ctx, twitchChannelId, configKey)
	if err != nil {
		fmt.Println(err.Error())
		return false
	}

	if configData != nil && configData.Value == configValue {
		return true
	}

	return false
}

func (m *MySQL) GetGlobalBotCommand(ctx context.Context, commandName string) (*models.BotCommand, error) {
	var botCommand models.BotCommand

	result := m.DB.Where("command_name = ?", commandName).Where("command_type = ?", 0).Where("status = ?", 1).First(&botCommand)
	if result.Error != nil {
		return nil, errors.New("(GetGlobalBotCommand) db.First Error:" + result.Error.Error())
	}

	return &botCommand, nil
}

func (m *MySQL) GetUserBotCommand(ctx context.Context, commandName string, twitchChannelId string) (*models.BotCommand, error) {
	var botCommand models.BotCommand

	result := m.DB.Where("command_name = ?", commandName).Where("twitch_channel_id = ?", twitchChannelId).Where("command_type = ?", 1).Where("status = ?", 1).First(&botCommand)
	if result.Error != nil {
		return nil, errors.New("(GetBotCommand) db.First Error:" + result.Error.Error())
	}

	return &botCommand, nil
}

func (m *MySQL) CreateBotCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string, createdBy string) (*string, error) {
	var botCommand []models.BotCommand
	var infoText string

	infoTextResp, err := m.CheckCommandExists(ctx, commandName, twitchChannelId)
	if err != nil {
		return nil, err
	}
	if infoTextResp != nil {
		return infoTextResp, nil
	}

	existAliasName, err := m.CheckCommandAliasExist(ctx, commandName, twitchChannelId)
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
		CommandType:     1,
		Status:          1,
		CreatedBy:       &createdBy,
	})

	result := m.DB.Create(&botCommand)
	if result.Error != nil {
		return nil, errors.New("(CreateBotCommand) db.Create Error:" + result.Error.Error())
	}

	return nil, nil
}

func (m *MySQL) CheckCommandExists(ctx context.Context, commandName string, twitchChannelId string) (*string, error) {
	var infoText string
	existGlobalCommandName, err := m.CheckGlobalCommandExists(ctx, commandName)
	if err != nil {
		return nil, err
	}

	existUserCommandName, err := m.CheckUserCommandExists(ctx, commandName, twitchChannelId)
	if err != nil {
		return nil, err
	}

	if existUserCommandName != nil || existGlobalCommandName != nil {
		if existUserCommandName != nil {
			infoText = "the command \"" + *existUserCommandName + "\" is already in use"
			return &infoText, nil
		}
		if existGlobalCommandName != nil {
			infoText = "the command \"" + *existGlobalCommandName + "\" is used as a global command"
			return &infoText, nil
		}
	}

	return nil, nil
}

func (m *MySQL) CheckGlobalCommandExists(ctx context.Context, commandName string) (*string, error) {
	var botCommand []models.BotCommand

	result := m.DB.Where("command_name = ?", commandName).Where("command_type", 0).Find(&botCommand)
	if result.Error != nil {
		return nil, errors.New("(CheckGlobalCommandExists) db.Find Error:" + result.Error.Error())
	}
	if len(botCommand) > 0 {
		return &botCommand[0].CommandName, nil
	}

	return nil, nil
}

func (m *MySQL) CheckUserCommandExists(ctx context.Context, commandName string, twitchChannelId string) (*string, error) {
	var botCommand []models.BotCommand

	result := m.DB.Where("command_name = ?", commandName).Where("twitch_channel_id", twitchChannelId).Where("command_type = ?", 1).Find(&botCommand)
	if result.Error != nil {
		return nil, errors.New("(CheckUserCommandExists) db.Find Error:" + result.Error.Error())
	}
	if len(botCommand) > 0 {
		return &botCommand[0].CommandName, nil
	}

	return nil, nil
}

func (m *MySQL) UpdateBotCommand(ctx context.Context, commandName string, commandContent string, twitchChannelId string, updatedBy string) (*string, *string, error) {
	var botCommand *models.BotCommand

	command, _ := m.GetCommandAlias(ctx, commandName, twitchChannelId)
	if command != nil {
		commandName = *command
	}

	infoTextResp, err := m.CheckUserCommandExists(ctx, commandName, twitchChannelId)
	if err != nil {
		return nil, nil, err
	}
	if infoTextResp == nil {
		var infoText = "the command \"" + commandName + "\" does not exist"
		return nil, &infoText, nil
	}

	result := m.DB.Where("command_name = ?", commandName).Where("twitch_channel_id = ?", twitchChannelId).First(&botCommand)
	if result.Error != nil {
		return nil, nil, errors.New("(UpdateBotCommand) db.Find Error:" + result.Error.Error())
	}

	result = m.DB.Model(&botCommand).Updates(models.BotCommand{
		CommandContent: commandContent,
		UpdatedBy:      &updatedBy,
	})
	if result.Error != nil {
		return nil, nil, errors.New("(UpdateBotCommand) db.Update Error:" + result.Error.Error())
	}

	return &commandName, nil, nil
}

func (m *MySQL) DeleteBotCommand(ctx context.Context, commandName string, twitchChannelId string) (*string, *string, error) {
	var botCommand *models.BotCommand
	var botCommandAlias *models.BotCommandAlias

	command, _ := m.GetCommandAlias(ctx, commandName, twitchChannelId)
	if command != nil {
		commandName = *command
	}

	infoTextResp, err := m.CheckUserCommandExists(ctx, commandName, twitchChannelId)
	if err != nil {
		return nil, nil, err
	}
	if infoTextResp == nil {
		var infoText = "the command \"" + commandName + "\" does not exist"
		return nil, &infoText, nil
	}

	aliasDelete := m.DB.Where("command_name = ?", commandName).Where("twitch_channel_id = ?", twitchChannelId).Delete(&botCommandAlias)
	if aliasDelete.Error != nil {
		return nil, nil, errors.New("(DeleteBotCommand) botCommandAlias db.AliasDelete Error: " + aliasDelete.Error.Error())
	}

	result := m.DB.Where("command_name = ?", commandName).Where("twitch_channel_id = ?", twitchChannelId).First(&botCommand)
	if result.Error != nil {
		return nil, nil, errors.New("(DeleteBotCommand) botCommand db.First Error:" + result.Error.Error())
	}

	result = m.DB.Delete(&botCommand)
	if result.Error != nil {
		return nil, nil, errors.New("(DeleteBotCommand) botCommand db.Delete Error:" + result.Error.Error())
	}

	return &commandName, nil, nil
}

func (m *MySQL) GetCommandList(ctx context.Context, twitchChannelId string) ([]*models.BotCommand, error) {
	var botCommandList []*models.BotCommand

	result := m.DB.Where("twitch_channel_id = ?", twitchChannelId).Where("command_type = ?", 1).Find(&botCommandList)
	if result.Error != nil {
		return nil, errors.New("(GetTwitchChannels) db.Find Error:" + result.Error.Error())
	}

	return botCommandList, nil
}

func (m *MySQL) CreateBotActionActivity(ctx context.Context, botPlatformType string, botActivity string, twitchChannelId string, activityAuthor, activityAuthorId string) error {
	botActionActivity := models.BotActionActivity{
		BotPlatformType:  botPlatformType,
		BotActivity:      botActivity,
		TwitchChannelID:  &twitchChannelId,
		ActivityAuthor:   &activityAuthor,
		ActivityAuthorID: &activityAuthorId,
	}

	result := m.DB.Create(&botActionActivity)

	if result.Error != nil {
		return errors.New("(CreateBotActionActivity) db.Create Error:" + result.Error.Error())
	}

	return nil
}

func (m *MySQL) SaveBotCommandActivity(context context.Context, commandName string, twitchChannelId string, commandAuthor, commandAuthorId string) {
	check := m.CheckConfig(context, twitchChannelId, "bot_activity_enabled", "1")
	if !check {
		return
	}

	commandName = "!" + commandName

	if err := m.CreateBotActionActivity(context, "twitch", commandName, twitchChannelId, commandAuthor, commandAuthorId); err != nil {
		fmt.Println(err.Error())
	}
}

func (m *MySQL) CreateCommandAliases(ctx context.Context, commandName string, aliases []string, twitchChannelId string, createdBy string) (*string, error) {
	commandAliases := []models.BotCommandAlias{}
	var infoText string

	command, _ := m.GetCommandAlias(ctx, commandName, twitchChannelId)
	if command != nil {
		commandName = *command
	}

	// Check command exists
	infoTextResp, _ := m.CheckUserCommandExists(ctx, commandName, twitchChannelId)
	if infoTextResp == nil {
		infoText = "the command \"" + commandName + "\" does not exist"
		return &infoText, nil
	}

	for _, aliasCommandName := range aliases {
		existAlias, err := m.CheckCommandAliasExist(ctx, aliasCommandName, twitchChannelId)
		if err != nil {
			return nil, err
		}
		if existAlias != nil {
			infoText = "the command alias \"" + *existAlias + "\" already exists"
			return &infoText, nil
		}

		infoTextResp, _ := m.CheckCommandExists(ctx, aliasCommandName, twitchChannelId)
		if infoTextResp != nil {
			return infoTextResp, nil
		}

		if aliasCommandName == commandName {
			infoText = "you cannot use the same name in command and command alias"
			return &infoText, nil
		}

		commandAlias := models.BotCommandAlias{
			CommandAlias:    aliasCommandName,
			CommandName:     commandName,
			TwitchChannelID: &twitchChannelId,
			Status:          1,
			CreatedBy:       createdBy,
		}
		commandAliases = append(commandAliases, commandAlias)
	}

	err := m.DB.Save(&commandAliases).Error
	if err != nil {
		return nil, errors.New("(CreateCommandAliases) db.Save Error:" + err.Error())
	}

	return nil, nil
}

func (m *MySQL) GetCommandAlias(ctx context.Context, command string, twitchChannelId string) (*string, error) {
	var commandAlias models.BotCommandAlias

	err := m.DB.Where("command_alias = ?", command).Where("twitch_channel_id = ?", twitchChannelId).Where("status = ?", 1).First(&commandAlias).Error
	if err != nil {
		return nil, errors.New("(GetCommandAlias) db.Find Error:" + err.Error())
	}

	return &commandAlias.CommandName, nil
}

func (m *MySQL) CheckCommandAliasExist(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error) {
	var commandAliasModel []models.BotCommandAlias

	result := m.DB.Where("command_alias = ?", commandAlias).Where("twitch_channel_id", twitchChannelId).Find(&commandAliasModel)
	if result.Error != nil {
		return nil, errors.New("(CheckCommandAlias) db.Find Error:" + result.Error.Error())
	}

	if len(commandAliasModel) > 0 {
		return &commandAliasModel[0].CommandAlias, nil
	}

	return nil, nil
}

func (m *MySQL) DeleteCommandAlias(ctx context.Context, commandAlias string, twitchChannelId string) (*string, error) {
	var commandAliasModel *models.BotCommandAlias

	existAlias, err := m.CheckCommandAliasExist(ctx, commandAlias, twitchChannelId)
	if err != nil {
		return nil, err
	}

	if existAlias == nil {
		var infoText = "the command alias \"" + commandAlias + "\" des not exist"
		return &infoText, nil
	}

	result := m.DB.Where("command_alias = ?", commandAlias).Where("twitch_channel_id = ?", twitchChannelId).First(&commandAliasModel)
	if result.Error != nil {
		return nil, errors.New("(DeleteCommandAlias) db.First Error:" + result.Error.Error())
	}

	result = m.DB.Delete(&commandAliasModel)
	if result.Error != nil {
		return nil, errors.New("(DeleteCommandAlias) db.Delete Error:" + result.Error.Error())
	}

	return nil, nil
}

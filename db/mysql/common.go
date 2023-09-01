package mysql

import (
	"context"
	"errors"

	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
	"gorm.io/gorm"
)

func (m *MySQL) CreateBotCommand(ctx context.Context, botPlatformName string, commandName string, commandContent string, botPlatformId string, createdBy string) (*string, error) {
	var botCommand []models.BotCommand
	var infoText string
	var twitchChannelId, discordServerId string

	switch botPlatformName {
	case "twitch":
		twitchChannelId = botPlatformId
	case "discord":
		discordServerId = botPlatformId
	}

	infoTextResp, err := m.CheckCommandExists(ctx, botPlatformName, commandName, botPlatformId)
	if err != nil {
		return nil, err
	}
	if infoTextResp != nil {
		return infoTextResp, nil
	}

	existAliasName, err := m.CheckCommandAliasExist(ctx, botPlatformName, commandName, botPlatformId)
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
		TwitchChannelID: &twitchChannelId,
		DiscordServerID: &discordServerId,
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

func (m *MySQL) UpdateBotCommand(ctx context.Context, botPlatformName string, commandName string, commandContent string, botPlatformId string, updatedBy string) (*string, *string, error) {
	var botCommand *models.BotCommand
	var result *gorm.DB

	command, _ := m.GetCommandAlias(ctx, botPlatformName, commandName, botPlatformId)
	if command != nil {
		commandName = *command
	}

	infoTextResp, err := m.CheckUserCommandExists(ctx, botPlatformName, commandName, botPlatformId)
	if err != nil {
		return nil, nil, err
	}
	if infoTextResp == nil {
		var infoText = "the command \"" + commandName + "\" does not exist"
		return nil, &infoText, nil
	}

	switch botPlatformName {
	case "twitch":
		result = m.DB.Where("command_name = ?", commandName).Where("twitch_channel_id = ?", botPlatformId).First(&botCommand)
	case "discord":
		result = m.DB.Where("command_name = ?", commandName).Where("discord_server_id = ?", botPlatformId).First(&botCommand)
	}
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

func (m *MySQL) DeleteBotCommand(ctx context.Context, botPlatformName string, commandName string, botPlatformId string) (*string, *string, error) {
	var botCommand *models.BotCommand
	var botCommandAlias *models.BotCommandAlias
	var result *gorm.DB

	command, _ := m.GetCommandAlias(ctx, botPlatformName, commandName, botPlatformId)
	if command != nil {
		commandName = *command
	}

	infoTextResp, err := m.CheckUserCommandExists(ctx, botPlatformName, commandName, botPlatformId)
	if err != nil {
		return nil, nil, err
	}
	if infoTextResp == nil {
		var infoText = "the command \"" + commandName + "\" does not exist"
		return nil, &infoText, nil
	}

	switch botPlatformName {
	case "twitch":
		result = m.DB.Where("command_name = ?", commandName).Where("twitch_channel_id = ?", botPlatformId).Delete(&botCommandAlias)
		if result.Error != nil {
			return nil, nil, errors.New("(DeleteBotCommand) botCommandAlias db.AliasDelete Error: " + result.Error.Error())
		}

		result = m.DB.Where("command_name = ?", commandName).Where("twitch_channel_id = ?", botPlatformId).First(&botCommand)
		if result.Error != nil {
			return nil, nil, errors.New("(DeleteBotCommand) botCommand db.First Error:" + result.Error.Error())
		}
	case "discord":
		result = m.DB.Where("command_name = ?", commandName).Where("discord_server_id = ?", botPlatformId).Delete(&botCommandAlias)
		if result.Error != nil {
			return nil, nil, errors.New("(DeleteBotCommand) botCommandAlias db.AliasDelete Error: " + result.Error.Error())
		}

		result = m.DB.Where("command_name = ?", commandName).Where("discord_server_id = ?", botPlatformId).First(&botCommand)
		if result.Error != nil {
			return nil, nil, errors.New("(DeleteBotCommand) botCommand db.First Error:" + result.Error.Error())
		}
	}

	result = m.DB.Delete(&botCommand)
	if result.Error != nil {
		return nil, nil, errors.New("(DeleteBotCommand) botCommand db.Delete Error:" + result.Error.Error())
	}

	return &commandName, nil, nil
}

func (m *MySQL) CheckCommandExists(ctx context.Context, botPlatformName string, commandName string, botPlatformId string) (*string, error) {
	var infoText string
	existGlobalCommandName, err := m.CheckGlobalCommandExists(ctx, commandName)
	if err != nil {
		return nil, err
	}

	existUserCommandName, err := m.CheckUserCommandExists(ctx, botPlatformName, commandName, botPlatformId)
	if err != nil {
		return nil, err
	}

	existAliasCommandName, err := m.CheckCommandAliasExist(ctx, botPlatformName, commandName, botPlatformId)
	if err != nil {
		return nil, err
	}

	if existUserCommandName != nil || existGlobalCommandName != nil || existAliasCommandName != nil {
		if existAliasCommandName != nil {
			infoText = *existAliasCommandName
			return &infoText, nil
		}
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

func (m *MySQL) CheckUserCommandExists(ctx context.Context, botPlatformName string, commandName string, botPlatformId string) (*string, error) {
	var botCommand []models.BotCommand
	var result *gorm.DB

	switch botPlatformName {
	case "twitch":
		result = m.DB.Where("command_name = ?", commandName).Where("twitch_channel_id", botPlatformId).Where("command_type = ?", 1).Find(&botCommand)
	case "discord":
		result = m.DB.Where("command_name = ?", commandName).Where("discord_server_id", botPlatformId).Where("command_type = ?", 1).Find(&botCommand)
	}
	if result.Error != nil {
		return nil, errors.New("(CheckUserCommandExists) db.Find Error:" + result.Error.Error())
	}
	if len(botCommand) > 0 {
		return &botCommand[0].CommandName, nil
	}

	return nil, nil
}

func (m *MySQL) GetCommandAlias(ctx context.Context, botPlatformName string, command string, botPlatformId string) (*string, error) {
	var commandAlias models.BotCommandAlias
	var err error

	switch botPlatformName {
	case "twitch":
		err = m.DB.Where("command_alias = ?", command).Where("twitch_channel_id = ?", botPlatformId).Where("status = ?", 1).First(&commandAlias).Error
	case "discord":
		err = m.DB.Where("command_alias = ?", command).Where("discord_server_id = ?", botPlatformId).Where("status = ?", 1).First(&commandAlias).Error
	}
	if err != nil {
		return nil, errors.New("(GetCommandAlias) db.Find Error:" + err.Error())
	}

	return &commandAlias.CommandName, nil
}

func (m *MySQL) CheckCommandAliasExist(ctx context.Context, botPlatformName string, commandAlias string, botPlatformId string) (*string, error) {
	var commandAliasModel []models.BotCommandAlias
	var result *gorm.DB

	switch botPlatformName {
	case "twitch":
		result = m.DB.Where("command_alias = ?", commandAlias).Where("twitch_channel_id", botPlatformId).Find(&commandAliasModel)
	case "discord":
		result = m.DB.Where("command_alias = ?", commandAlias).Where("discord_server_id", botPlatformId).Find(&commandAliasModel)
	}
	if result.Error != nil {
		return nil, errors.New("(CheckCommandAlias) db.Find Error:" + result.Error.Error())
	}

	if len(commandAliasModel) > 0 {
		return &commandAliasModel[0].CommandAlias, nil
	}

	return nil, nil
}

func (m *MySQL) CreateCommandAlias(ctx context.Context, botPlatformName string, commandName string, aliases []string, botPlatformId string, createdBy string) (*string, error) {
	commandAliases := []models.BotCommandAlias{}
	var infoText string

	command, _ := m.GetCommandAlias(ctx, botPlatformName, commandName, botPlatformId)
	if command != nil {
		commandName = *command
	}

	for _, aliasCommandName := range aliases {
		existAlias, err := m.CheckCommandAliasExist(ctx, botPlatformName, aliasCommandName, botPlatformId)
		if err != nil {
			return nil, err
		}
		if existAlias != nil {
			infoText = "the command alias \"" + *existAlias + "\" already exists"
			return &infoText, nil
		}

		infoTextResp, _ := m.CheckCommandExists(ctx, botPlatformName, aliasCommandName, botPlatformId)
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
			TwitchChannelID: &botPlatformId,
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

func (m *MySQL) DeleteCommandAlias(ctx context.Context, botPlatformName string, commandAlias string, botPlatformId string) (*string, error) {
	var commandAliasModel *models.BotCommandAlias
	var result *gorm.DB

	existAlias, err := m.CheckCommandAliasExist(ctx, botPlatformName, commandAlias, botPlatformId)
	if err != nil {
		return nil, err
	}

	if existAlias == nil {
		var infoText = "the command alias \"" + commandAlias + "\" des not exist"
		return &infoText, nil
	}

	switch botPlatformName {
	case "twitch":
		result = m.DB.Where("command_alias = ?", commandAlias).Where("twitch_channel_id = ?", botPlatformId).First(&commandAliasModel)
	case "discord":
		result = m.DB.Where("command_alias = ?", commandAlias).Where("discord_server_id = ?", botPlatformId).First(&commandAliasModel)
	}
	if result.Error != nil {
		return nil, errors.New("(DeleteCommandAlias) db.First Error:" + result.Error.Error())
	}

	result = m.DB.Delete(&commandAliasModel)
	if result.Error != nil {
		return nil, errors.New("(DeleteCommandAlias) db.Delete Error:" + result.Error.Error())
	}

	return nil, nil
}

func (m *MySQL) CreateBotActionActivity(ctx context.Context, botPlatformType string, botActivity string, botPlatformId string, activityAuthor, activityAuthorId string) error {
	botActionActivity := models.BotActionActivity{
		BotPlatformType:  botPlatformType,
		BotActivity:      botActivity,
		BotPlatformID:    &botPlatformId,
		ActivityAuthor:   &activityAuthor,
		ActivityAuthorID: &activityAuthorId,
	}

	result := m.DB.Create(&botActionActivity)

	if result.Error != nil {
		return errors.New("(CreateBotActionActivity) db.Create Error:" + result.Error.Error())
	}

	return nil
}

func (m *MySQL) GetGlobalBotCommand(ctx context.Context, commandName string) (*models.BotCommand, error) {
	var botCommand models.BotCommand

	result := m.DB.Where("command_name = ?", commandName).Where("command_type = ?", 0).Where("status = ?", 1).First(&botCommand)
	if result.Error != nil {
		return nil, errors.New("(GetGlobalBotCommand) db.First Error:" + result.Error.Error())
	}

	return &botCommand, nil
}

func (m *MySQL) GetUserBotCommand(ctx context.Context, botPlatformName string, commandName string, botPlatformId string) (*models.BotCommand, error) {
	var botCommand models.BotCommand
	var result *gorm.DB

	switch botPlatformName {
	case "twitch":
		result = m.DB.Where("command_name = ?", commandName).Where("twitch_channel_id = ?", botPlatformId).Where("command_type = ?", 1).Where("status = ?", 1).First(&botCommand)
	case "discord":
		result = m.DB.Where("command_name = ?", commandName).Where("discord_server_id = ?", botPlatformId).Where("command_type = ?", 1).Where("status = ?", 1).First(&botCommand)
	}
	if result.Error != nil {
		return nil, errors.New("(GetBotCommand) db.First Error:" + result.Error.Error())
	}

	return &botCommand, nil
}

func (m *MySQL) GetCommandList(ctx context.Context, botPlatformName string, botPlatformId string) ([]*models.BotCommand, error) {
	var botCommandList []*models.BotCommand
	var result *gorm.DB

	switch botPlatformName {
	case "twitch":
		result = m.DB.Where("twitch_channel_id = ?", botPlatformId).Where("command_type = ?", 1).Find(&botCommandList)
	case "discord":
		result = m.DB.Where("discord_server_id = ?", botPlatformId).Where("command_type = ?", 1).Find(&botCommandList)
	}
	if result.Error != nil {
		return nil, errors.New("(GetCommandList) db.Find Error:" + result.Error.Error())
	}

	return botCommandList, nil
}

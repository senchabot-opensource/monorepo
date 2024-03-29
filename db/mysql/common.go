package mysql

import (
	"context"
	"errors"
	"log"

	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/platform"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func (m *MySQL) CreateBotCommand(ctx context.Context, botPlatform platform.Platform, commandName string, commandContent string, botPlatformId string, createdBy string) (*string, error) {
	var botCommand []models.BotCommand
	var infoText string
	var twitchChannelId, discordServerId string

	switch botPlatform {
	case platform.TWITCH:
		twitchChannelId = botPlatformId
	case platform.DISCORD:
		discordServerId = botPlatformId
	}

	infoTextResp, err := m.CheckCommandExists(ctx, botPlatform, commandName, botPlatformId)
	if err != nil {
		return nil, err
	}
	if infoTextResp != nil {
		return infoTextResp, nil
	}

	existAliasName, err := m.CheckCommandAliasExist(ctx, botPlatform, commandName, botPlatformId)
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

func (m *MySQL) UpdateBotCommand(ctx context.Context, botPlatform platform.Platform, commandName string, commandContent string, botPlatformId string, updatedBy string) (*string, *string, error) {
	var botCommand *models.BotCommand
	var result *gorm.DB

	command, _ := m.GetCommandAlias(ctx, botPlatform, commandName, botPlatformId)
	if command != nil {
		commandName = *command
	}

	infoTextResp, err := m.CheckUserCommandExists(ctx, botPlatform, commandName, botPlatformId)
	if err != nil {
		return nil, nil, err
	}
	if infoTextResp == nil {
		var infoText = "the command \"" + commandName + "\" does not exist"
		return nil, &infoText, nil
	}

	switch botPlatform {
	case platform.TWITCH:
		result = m.DB.Where("command_name = ?", commandName).Where("twitch_channel_id = ?", botPlatformId).First(&botCommand)
	case platform.DISCORD:
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

func (m *MySQL) DeleteBotCommand(ctx context.Context, botPlatform platform.Platform, commandName string, botPlatformId string) (*string, *string, error) {
	var botCommand *models.BotCommand
	var botCommandAlias *models.BotCommandAlias
	var result *gorm.DB

	command, _ := m.GetCommandAlias(ctx, botPlatform, commandName, botPlatformId)
	if command != nil {
		commandName = *command
	}

	infoTextResp, err := m.CheckUserCommandExists(ctx, botPlatform, commandName, botPlatformId)
	if err != nil {
		return nil, nil, err
	}
	if infoTextResp == nil {
		var infoText = "the command \"" + commandName + "\" does not exist"
		return nil, &infoText, nil
	}

	switch botPlatform {
	case platform.TWITCH:
		result = m.DB.Where("command_name = ?", commandName).Where("twitch_channel_id = ?", botPlatformId).Delete(&botCommandAlias)
		if result.Error != nil {
			return nil, nil, errors.New("(DeleteBotCommand) botCommandAlias db.AliasDelete Error: " + result.Error.Error())
		}

		result = m.DB.Where("command_name = ?", commandName).Where("twitch_channel_id = ?", botPlatformId).First(&botCommand)
		if result.Error != nil {
			return nil, nil, errors.New("(DeleteBotCommand) botCommand db.First Error:" + result.Error.Error())
		}
	case platform.DISCORD:
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

func (m *MySQL) CheckCommandExists(ctx context.Context, botPlatform platform.Platform, commandName string, botPlatformId string) (*string, error) {
	var infoText string
	existGlobalCommandName, err := m.CheckGlobalCommandExists(ctx, commandName)
	if err != nil {
		return nil, err
	}

	existUserCommandName, err := m.CheckUserCommandExists(ctx, botPlatform, commandName, botPlatformId)
	if err != nil {
		return nil, err
	}

	existAliasCommandName, err := m.CheckCommandAliasExist(ctx, botPlatform, commandName, botPlatformId)
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

func (m *MySQL) CheckUserCommandExists(ctx context.Context, botPlatform platform.Platform, commandName string, botPlatformId string) (*string, error) {
	var botCommand []models.BotCommand
	var result *gorm.DB

	switch botPlatform {
	case platform.TWITCH:
		result = m.DB.Where("command_name = ?", commandName).Where("twitch_channel_id", botPlatformId).Where("command_type = ?", 1).Find(&botCommand)
	case platform.DISCORD:
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

func (m *MySQL) GetCommandAlias(ctx context.Context, botPlatform platform.Platform, command string, botPlatformId string) (*string, error) {
	var commandAlias models.BotCommandAlias
	var err error

	switch botPlatform {
	case platform.TWITCH:
		err = m.DB.Where("command_alias = ?", command).Where("twitch_channel_id = ?", botPlatformId).Where("status = ?", 1).First(&commandAlias).Error
	case platform.DISCORD:
		err = m.DB.Where("command_alias = ?", command).Where("discord_server_id = ?", botPlatformId).Where("status = ?", 1).First(&commandAlias).Error
	}
	if err != nil {
		return nil, errors.New("(GetCommandAlias) db.Find Error:" + err.Error())
	}

	return &commandAlias.CommandName, nil
}

func (m *MySQL) CheckCommandAliasExist(ctx context.Context, botPlatform platform.Platform, commandAlias string, botPlatformId string) (*string, error) {
	var commandAliasModel []models.BotCommandAlias
	var result *gorm.DB

	switch botPlatform {
	case platform.TWITCH:
		result = m.DB.Where("command_alias = ?", commandAlias).Where("twitch_channel_id", botPlatformId).Find(&commandAliasModel)
	case platform.DISCORD:
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

func (m *MySQL) CreateCommandAlias(ctx context.Context, botPlatform platform.Platform, commandName string, aliases []string, botPlatformId string, createdBy string) (*string, error) {
	commandAliases := []models.BotCommandAlias{}
	var infoText string
	var twitchChannelId, discordServerId string

	switch botPlatform {
	case platform.TWITCH:
		twitchChannelId = botPlatformId
	case platform.DISCORD:
		discordServerId = botPlatformId
	}

	command, _ := m.GetCommandAlias(ctx, botPlatform, commandName, botPlatformId)
	if command != nil {
		commandName = *command
	}

	for _, aliasCommandName := range aliases {
		existAlias, err := m.CheckCommandAliasExist(ctx, botPlatform, aliasCommandName, botPlatformId)
		if err != nil {
			return nil, err
		}
		if existAlias != nil {
			infoText = "the command alias \"" + *existAlias + "\" already exists"
			return &infoText, nil
		}

		infoTextResp, _ := m.CheckCommandExists(ctx, botPlatform, aliasCommandName, botPlatformId)
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
			DiscordServerID: &discordServerId,
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

func (m *MySQL) DeleteCommandAlias(ctx context.Context, botPlatform platform.Platform, commandAlias string, botPlatformId string) (*string, error) {
	var commandAliasModel *models.BotCommandAlias
	var result *gorm.DB

	existAlias, err := m.CheckCommandAliasExist(ctx, botPlatform, commandAlias, botPlatformId)
	if err != nil {
		return nil, err
	}

	if existAlias == nil {
		var infoText = "the command alias \"" + commandAlias + "\" des not exist"
		return &infoText, nil
	}

	switch botPlatform {
	case platform.TWITCH:
		result = m.DB.Where("command_alias = ?", commandAlias).Where("twitch_channel_id = ?", botPlatformId).First(&commandAliasModel)
	case platform.DISCORD:
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

func (m *MySQL) CreateBotActionActivity(ctx context.Context, botPlatform platform.Platform, botActivity string, botPlatformId string, activityAuthor, activityAuthorId string) error {
	botActionActivity := models.BotActionActivity{
		BotPlatformType:  botPlatform,
		BotPlatformID:    &botPlatformId,
		BotActivity:      botActivity,
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

func (m *MySQL) GetUserBotCommand(ctx context.Context, botPlatform platform.Platform, commandName string, botPlatformId string) (*models.BotCommand, error) {
	var botCommand models.BotCommand
	var result *gorm.DB

	switch botPlatform {
	case platform.TWITCH:
		result = m.DB.Where("command_name = ?", commandName).Where("twitch_channel_id = ?", botPlatformId).Where("command_type = ?", 1).Where("status = ?", 1).First(&botCommand)
	case platform.DISCORD:
		result = m.DB.Where("command_name = ?", commandName).Where("discord_server_id = ?", botPlatformId).Where("command_type = ?", 1).Where("status = ?", 1).First(&botCommand)
	}
	if result.Error != nil {
		return nil, errors.New("(GetBotCommand) db.First Error:" + result.Error.Error())
	}

	return &botCommand, nil
}

func (m *MySQL) GetCommandList(ctx context.Context, botPlatform platform.Platform, botPlatformId string) ([]*models.BotCommand, error) {
	var botCommandList []*models.BotCommand
	var result *gorm.DB

	switch botPlatform {
	case platform.TWITCH:
		result = m.DB.Where("twitch_channel_id = ?", botPlatformId).Where("command_type = ?", 1).Find(&botCommandList)
	case platform.DISCORD:
		result = m.DB.Where("discord_server_id = ?", botPlatformId).Where("command_type = ?", 1).Find(&botCommandList)
	}
	if result.Error != nil {
		return nil, errors.New("(GetCommandList) db.Find Error:" + result.Error.Error())
	}

	return botCommandList, nil
}

func (m *MySQL) AddBotCommandStatistic(ctx context.Context, botPlatform platform.Platform, commandName string) error {
	botCommandStatistic := models.BotCommandStatistic{CommandName: commandName, BotPlatformType: botPlatform, Count: 1}

	result := m.DB.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "id"}},
		DoUpdates: clause.Assignments(map[string]interface{}{"count": gorm.Expr("count + 1")}),
	}).Where("bot_platform_type = ?", botPlatform).Where("command_name = ?", commandName).Create(&botCommandStatistic)

	if result.Error != nil {
		log.Println("(AddBotcommandStatistic): db.Update Error: ", result.Error.Error())
		return result.Error
	}

	return nil
}

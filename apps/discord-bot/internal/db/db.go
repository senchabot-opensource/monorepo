package db

import (
	"context"
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// DB

type MySQL struct {
	DB *gorm.DB
}

func NewMySQL() *MySQL {
	dsn := os.Getenv("DATABASE_URL")
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{Logger: logger.Default.LogMode(logger.Silent)})

	if err != nil {
		panic("failed to connect database")
	}
	return &MySQL{
		DB: db,
	}
}

func (m *MySQL) CheckCommandExists(ctx context.Context, commandName string, discordServerId string) (*string, error) {
	var botCommand []models.BotCommand

	result := m.DB.Where("command_name = ?", commandName).Where("discord_server_id", discordServerId).Find(&botCommand)
	if result.Error != nil {
		return nil, errors.New("(CheckCommandExists) db.Find Error:" + result.Error.Error())
	}
	if len(botCommand) > 0 {
		return &botCommand[0].CommandName, nil
	}

	return nil, nil
}

func (m *MySQL) CreateBotCommand(ctx context.Context, commandName string, commandContent string, discordServerId string, createdBy string) (*string, error) {
	var botCommand []models.BotCommand
	var infoText string

	existCommandName, err := m.CheckCommandExists(ctx, commandName, discordServerId)
	if err != nil {
		return nil, err
	}
	if existCommandName != nil {
		infoText = "the command \"" + *existCommandName + "\" is already in use"
		return &infoText, nil
	}

	botCommand = append(botCommand, models.BotCommand{
		CommandName:     commandName,
		CommandContent:  commandContent,
		DiscordServerID: discordServerId,
		CreatedBy:       &createdBy,
	})

	result := m.DB.Create(&botCommand)
	if result.Error != nil {
		return nil, errors.New("(CreateBotCommand) db.Create Error:" + result.Error.Error())
	}

	return nil, nil
}

func (m *MySQL) UpdateBotCommand(ctx context.Context, commandName string, commandContent string, discordServerId string, updatedBy string) (*string, *string, error) {
	var botCommand *models.BotCommand

	existCommandName, err := m.CheckCommandExists(ctx, commandName, discordServerId)
	if err != nil {
		return nil, nil, err
	}
	if existCommandName == nil {
		var infoText = "the command \"" + commandName + "\" does not exist"
		return nil, &infoText, nil
	}

	result := m.DB.Where("command_name = ?", commandName).Where("discord_server_id = ?", discordServerId).First(&botCommand)
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

func (m *MySQL) DeleteBotCommand(ctx context.Context, commandName string, discordServerId string) (*string, *string, error) {
	var botCommand *models.BotCommand

	existCommandName, err := m.CheckCommandExists(ctx, commandName, discordServerId)
	if err != nil {
		return nil, nil, err
	}
	if existCommandName == nil {
		var infoText = "the command \"" + commandName + "\" does not exist"
		return nil, &infoText, nil
	}

	result := m.DB.Where("command_name = ?", commandName).Where("discord_server_id = ?", discordServerId).Delete(&botCommand)
	if result.Error != nil {
		return nil, nil, errors.New("(DeleteBotCommand) botCommand db.Delete Error:" + result.Error.Error())
	}

	return &commandName, nil, nil
}

func (m *MySQL) GetBotCommand(ctx context.Context, commandName string, discordServerId string) (*models.BotCommand, error) {
	var botCommand models.BotCommand

	result := m.DB.Where("command_name = ?", commandName).Where("discord_server_id = ?", discordServerId).First(&botCommand)
	if result.Error != nil {
		return nil, errors.New("(GetBotCommand) db.First Error:" + result.Error.Error())
	}

	return &botCommand, nil
}

func (m *MySQL) SetDiscordBotConfig(ctx context.Context, serverId, key, value string) (bool, error) {
	var discordBotConfig []models.DiscordBotConfigs
	existConfig, err := m.GetDiscordBotConfig(ctx, serverId, key)
	if err != nil {
		return false, err
	}

	if existConfig != nil {
		result := m.DB.Model(&existConfig).Updates(models.DiscordBotConfigs{
			Key:   key,
			Value: value,
		})
		if result.Error != nil {
			return false, errors.New("(SetDiscordBotConfig) db.Updates Error:" + result.Error.Error())
		}

		return true, nil
	}

	discordBotConfig = append(discordBotConfig, models.DiscordBotConfigs{
		Key:      key,
		Value:    value,
		ServerID: serverId,
	})
	result := m.DB.Create(&discordBotConfig)
	if result.Error != nil {
		return false, errors.New("SetDiscordBotConfig db.Create Error:" + result.Error.Error())
	}

	return true, nil
}

func (m *MySQL) GetDiscordBotConfig(ctx context.Context, serverId, key string) (*models.DiscordBotConfigs, error) {
	var discordBotConfig []models.DiscordBotConfigs
	result := m.DB.Where("server_id = ?", serverId).Where("config_key = ?", key).Find(&discordBotConfig)
	if result.Error != nil {
		return nil, errors.New("(GetDiscordBotConfig) db.First Error:" + result.Error.Error())
	}

	if len(discordBotConfig) > 0 {
		return &discordBotConfig[0], nil
	}

	return nil, nil
}

func (m *MySQL) DeleteDiscordBotConfig(ctx context.Context, serverId, key string) (bool, error) {
	existConfig, err := m.GetDiscordBotConfig(ctx, serverId, key)
	if err != nil {
		return false, err
	}

	if existConfig == nil {
		return false, nil
	}

	result := m.DB.Model(&existConfig).Updates(models.DiscordBotConfigs{
		Key:   key,
		Value: "",
	})
	if result.Error != nil {
		return false, errors.New("(SetDiscordBotConfig) db.Updates Error:" + result.Error.Error())
	}

	return true, nil
}

func (m *MySQL) AddAnnouncementChannel(ctx context.Context, channelId, serverId, createdBy string) (bool, error) {
	var announcementChs []*models.DiscordAnnouncementChannels

	foundChannel, err := m.GetAnnouncementChannelByChannelId(ctx, channelId)
	if err != nil {
		return false, errors.New("(AddAnnouncementChannel) GetAnnouncementChannelByChannelId Error: " + err.Error())
	}

	if foundChannel != nil {
		return false, nil
	}

	announcementChs = append(announcementChs, &models.DiscordAnnouncementChannels{
		ChannelID: channelId,
		ServerID:  serverId,
		CreatedBy: createdBy,
	})

	result := m.DB.Create(&announcementChs)
	if result.Error != nil {
		return false, errors.New("(AddAnnouncementChannel) db.Create Error:" + result.Error.Error())
	}

	return true, nil
}

func (m *MySQL) GetAnnouncementChannels(ctx context.Context) ([]*models.DiscordAnnouncementChannels, error) {
	var announcementChs []*models.DiscordAnnouncementChannels

	result := m.DB.Find(&announcementChs)
	if result.Error != nil {
		return nil, errors.New("(GetAnnouncementChannels) db.Find Error:" + result.Error.Error())
	}

	return announcementChs, nil
}

func (m *MySQL) GetAnnouncementChannelByChannelId(ctx context.Context, channelId string) (*models.DiscordAnnouncementChannels, error) {
	var announcementChs []models.DiscordAnnouncementChannels
	result := m.DB.Where("channel_id = ?", channelId).Find(&announcementChs)
	if result.Error != nil {
		return nil, errors.New("(AddAnnouncementChannel) db.Find Error:" + result.Error.Error())
	}

	if len(announcementChs) == 0 {
		return nil, nil
	}

	return &announcementChs[0], nil
}

func (m *MySQL) GetAnnouncementChannelById(ctx context.Context, id int) (*models.DiscordAnnouncementChannels, error) {
	var announcementChs models.DiscordAnnouncementChannels

	result := m.DB.Where("id = ?", id).First(&announcementChs)
	if result.Error != nil {
		return nil, errors.New("(GetAnnouncementChannel) db.Find Error:" + result.Error.Error())
	}
	return &announcementChs, nil
}

func (m *MySQL) DeleteAnnouncementChannel(ctx context.Context, channelId string) (bool, error) {
	existAnnoCH, err := m.GetAnnouncementChannelByChannelId(ctx, channelId)
	if err != nil {
		return false, err
	}

	if existAnnoCH == nil {
		return false, nil
	}

	result := m.DB.Delete(&existAnnoCH)
	if result.Error != nil {
		return false, errors.New("(DeleteAnnouncementChannel) db.Delete Error:" + result.Error.Error())
	}

	return true, nil
}

func (m *MySQL) AddDiscordTwitchLiveAnnos(ctx context.Context, twitchUsername, twitchUserId, annoChannelId, annoServerId, createdBy string) (bool, error) {
	var twitchLiveAnnos []models.DiscordTwitchLiveAnnos

	twitchLiveAnno, err := m.GetDiscordTwitchLiveAnno(ctx, twitchUserId, annoServerId)
	if err != nil {
		return false, errors.New("(AddDiscordTwitchLiveAnnos) CheckDiscordTwitchLiveAnnos Error:" + err.Error())
	}
	if twitchLiveAnno != nil {
		result := m.DB.Model(&twitchLiveAnno).Updates(models.DiscordTwitchLiveAnnos{
			TwitchUsername: twitchUsername,
			TwitchUserID:   twitchUserId,
			AnnoChannelID:  annoChannelId,
			AnnoServerID:   annoServerId,
			CreatedBy:      createdBy,
		})
		if result.Error != nil {
			return false, errors.New("(AddDiscordTwitchLiveAnnos) db.Updates Error:" + result.Error.Error())
		}

		return false, nil
	}

	twitchLiveAnnos = append(twitchLiveAnnos, models.DiscordTwitchLiveAnnos{
		TwitchUsername: twitchUsername,
		TwitchUserID:   twitchUserId,
		AnnoChannelID:  annoChannelId,
		AnnoServerID:   annoServerId,
		Type:           1,
		CreatedBy:      createdBy,
	})

	result := m.DB.Create(&twitchLiveAnnos)
	if result.Error != nil {
		return false, errors.New("(AddDiscordTwitchLiveAnnos) db.Create Error:" + result.Error.Error())
	}

	return true, nil
}

func (m *MySQL) UpdateTwitchStreamerAnnoContent(ctx context.Context, twitchUsername, annoServerId string, annoContent *string) (bool, error) {

	twitchLiveAnno, err := m.GetDiscordTwitchLiveAnnoByUsername(ctx, twitchUsername, annoServerId)
	if err != nil {
		return false, errors.New("(UpdateTwitchStreamerAnnoContent) GetDiscordTwitchLiveAnnoByUsername Error:" + err.Error())
	}
	if twitchLiveAnno != nil {
		result := m.DB.Model(&twitchLiveAnno).Updates(models.DiscordTwitchLiveAnnos{
			AnnoContent: annoContent,
		})
		if result.Error != nil {
			return false, errors.New("(UpdateTwitchStreamerAnnoContent) db.Updates Error:" + result.Error.Error())
		}

		return true, nil
	}

	return false, nil
}

func (m *MySQL) UpdateTwitchStreamerLastAnnoDate(ctx context.Context, twitchUsername, annoServerId string, lastAnnoDate time.Time) (bool, error) {

	twitchLiveAnno, err := m.GetDiscordTwitchLiveAnnoByUsername(ctx, twitchUsername, annoServerId)
	if err != nil {
		return false, errors.New("(UpdateTwitchStreamerLastAnnoDate) GetDiscordTwitchLiveAnnoByUsername Error:" + err.Error())
	}
	if twitchLiveAnno != nil {
		result := m.DB.Model(&twitchLiveAnno).Updates(models.DiscordTwitchLiveAnnos{
			LastAnnoDate: &lastAnnoDate,
		})
		if result.Error != nil {
			return false, errors.New("(UpdateTwitchStreamerLastAnnoDate) db.Updates Error:" + result.Error.Error())
		}

		return true, nil
	}

	return false, nil
}

func (m *MySQL) GetTwitchStreamerLastAnnoDate(ctx context.Context, twitchUsername, annoServerId string) (*time.Time, error) {

	twitchLiveAnno, err := m.GetDiscordTwitchLiveAnnoByUsername(ctx, twitchUsername, annoServerId)
	if err != nil {
		return nil, errors.New("(CheckTwitchStreamerLastAnnoDate) GetDiscordTwitchLiveAnnoByUsername Error:" + err.Error())
	}
	if twitchLiveAnno != nil {
		return twitchLiveAnno.LastAnnoDate, nil
	}

	return nil, nil
}

func (m *MySQL) GetTwitchStreamerAnnoContent(ctx context.Context, twitchUsername, annoServerId string) (*string, error) {
	var twitchLiveAnnos []models.DiscordTwitchLiveAnnos

	result := m.DB.Where("twitch_username = ?", twitchUsername).Where("anno_server_id = ?", annoServerId).Find(&twitchLiveAnnos)
	if result.Error != nil {
		return nil, errors.New("(GetTwitchStreamerAnnoContent) db.Find Error:" + result.Error.Error())
	}

	if len(twitchLiveAnnos) == 0 {
		return nil, nil
	}

	return twitchLiveAnnos[0].AnnoContent, nil
}

func (m *MySQL) GetDiscordTwitchLiveAnno(ctx context.Context, twitchUserId, annoServerId string) (*models.DiscordTwitchLiveAnnos, error) {
	var twitchLiveAnnos []models.DiscordTwitchLiveAnnos

	result := m.DB.Where("twitch_user_id = ?", twitchUserId).Where("anno_server_id = ?", annoServerId).Find(&twitchLiveAnnos)
	if result.Error != nil {
		return nil, errors.New("(GetDiscordTwitchLiveAnno) db.Find Error:" + result.Error.Error())
	}

	if len(twitchLiveAnnos) == 0 {
		return nil, nil
	}

	return &twitchLiveAnnos[0], nil
}

func (m *MySQL) GetDiscordTwitchLiveAnnoByUsername(ctx context.Context, twitchUsername, annoServerId string) (*models.DiscordTwitchLiveAnnos, error) {
	var twitchLiveAnnos []models.DiscordTwitchLiveAnnos

	result := m.DB.Where("twitch_username = ?", twitchUsername).Where("anno_server_id = ?", annoServerId).Find(&twitchLiveAnnos)
	if result.Error != nil {
		return nil, errors.New("(GetDiscordTwitchLiveAnnoByUsername) db.Find Error:" + result.Error.Error())
	}

	if len(twitchLiveAnnos) == 0 {
		return nil, nil
	}

	return &twitchLiveAnnos[0], nil
}

func (m *MySQL) GetDiscordTwitchLiveAnnos(ctx context.Context, serverId string) ([]*models.DiscordTwitchLiveAnnos, error) {
	var twitchLiveAnnos []*models.DiscordTwitchLiveAnnos

	result := m.DB.Where("anno_server_id = ?", serverId).Find(&twitchLiveAnnos)
	if result.Error != nil {
		return nil, errors.New("(GetDiscordTwitchLiveAnnos) db.Find Error:" + result.Error.Error())
	}

	return twitchLiveAnnos, nil
}

func (m *MySQL) DeleteDiscordTwitchLiveAnno(ctx context.Context, twitchUserId string, serverId string) (bool, error) {
	existLiveAnno, err := m.GetDiscordTwitchLiveAnno(ctx, twitchUserId, serverId)
	if err != nil {
		return false, err
	}

	if existLiveAnno == nil {
		return false, nil
	}

	result := m.DB.Delete(&existLiveAnno)
	if result.Error != nil {
		return false, errors.New("(DeleteDiscordTwitchLiveAnno) db.Delete Error:" + result.Error.Error())
	}

	return true, nil
}

func (m *MySQL) DeleteDiscordTwitchLiveAnnosByGuildId(ctx context.Context, serverId string) (bool, error) {
	var twitchLiveAnnos models.DiscordTwitchLiveAnnos

	result := m.DB.Where("anno_server_id = ?", serverId).Delete(twitchLiveAnnos)
	if result.Error != nil {
		return false, errors.New("(DeleteDiscordTwitchLiveAnnosByGuildId) db.Delete Error:" + result.Error.Error())
	}

	return true, nil
}

func (m *MySQL) CheckConfig(ctx context.Context, discordServerId string, configKey string, configValue string) bool {
	configData, err := m.GetDiscordBotConfig(ctx, discordServerId, configKey)
	if err != nil {
		fmt.Println(err.Error())
		return false
	}

	if configData != nil && configData.Value == configValue {
		return true
	}

	return false
}

func (m *MySQL) CreateBotActionActivity(ctx context.Context, botPlatformType, botActivity, discordServerId, activityAuthor, activityAuthorId string) error {
	botActionActivity := models.BotActionActivity{
		BotPlatformType:  botPlatformType,
		BotActivity:      botActivity,
		DiscordServerID:  &discordServerId,
		ActivityAuthor:   &activityAuthor,
		ActivityAuthorID: &activityAuthorId,
	}

	result := m.DB.Create(&botActionActivity)

	if result.Error != nil {
		return errors.New("(CreateBotActionActivity) db.Create Error:" + result.Error.Error())
	}

	return nil
}

func (m *MySQL) SaveBotCommandActivity(context context.Context, activity, discordServerId, commandAuthor, commandAuthorId string) {
	check := m.CheckConfig(context, discordServerId, "bot_activity_enabled", "1")
	if !check {
		return
	}

	if err := m.CreateBotActionActivity(context, "discord", activity, discordServerId, commandAuthor, commandAuthorId); err != nil {
		fmt.Println(err.Error())
	}
}

func (m *MySQL) AddServerToDB(ctx context.Context, serverId string, serverName string, serverOwner string) error {
	var dcServer []models.DiscordServer

	result := m.DB.Where("server_id = ?", serverId).Find(&dcServer)
	if result.Error != nil {
		return errors.New("(AddServerToDB) db.Find Error:" + result.Error.Error())
	}

	if len(dcServer) > 0 {
		result = m.DB.Where("server_id = ?", serverId).Updates(&models.DiscordServer{ServerName: serverName, ServerOwner: serverOwner})
		if result.Error != nil {
			return errors.New("(AddServerToDB) db.Updates Error:" + result.Error.Error())
		}
		return nil
	}

	dcServer = append(dcServer, models.DiscordServer{
		ServerID:    serverId,
		ServerName:  serverName,
		ServerOwner: serverOwner,
	})

	result = m.DB.Create(&dcServer)
	if result.Error != nil {
		return errors.New("(AddServerToDB) db.Create Error:" + result.Error.Error())
	}

	return nil
}

func (m *MySQL) DeleteServerFromDB(ctx context.Context, serverId string) error {
	var dcServer *models.DiscordServer

	result := m.DB.Where("server_id = ?", serverId).Delete(&dcServer)
	if result.Error != nil {
		return errors.New("(DeleteServerFromDB) db.Delete Error:" + result.Error.Error())
	}

	return nil
}

// COMMAND ALIAS
func (m *MySQL) CreateCommandAlias(ctx context.Context, commandName string, aliases []string, discordServerId string, createdBy string) (*string, error) {
	commandAliases := []models.BotCommandAlias{}
	var infoText string

	command, _ := m.GetCommandAlias(ctx, commandName, discordServerId)
	if command != nil {
		commandName = *command
	}

	// Check command exists
	commandExist, _ := m.CheckCommandExists(ctx, commandName, discordServerId)
	if commandExist == nil {
		infoText = "the command \"" + commandName + "\" does not exist"
		return &infoText, nil
	}

	for _, aliasCommandName := range aliases {
		existAlias, err := m.CheckCommandAliasExist(ctx, aliasCommandName, discordServerId)
		if err != nil {
			return nil, err
		}
		if existAlias != nil {
			infoText = "the command alias \"" + *existAlias + "\" already exists"
			return &infoText, nil
		}

		commandExist, _ := m.CheckCommandExists(ctx, aliasCommandName, discordServerId)
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
			DiscordServerID: &discordServerId,
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

func (m *MySQL) GetCommandAlias(ctx context.Context, command string, discordServerId string) (*string, error) {
	var commandAlias models.BotCommandAlias

	err := m.DB.Where("command_alias = ?", command).Where("discord_server_id = ?", discordServerId).First(&commandAlias).Error
	if err != nil {
		return nil, errors.New("(GetCommandAlias) db.Find Error:" + err.Error())
	}

	return &commandAlias.CommandName, nil
}

func (m *MySQL) CheckCommandAliasExist(ctx context.Context, commandAlias string, discordServerId string) (*string, error) {
	var commandAliasModel []models.BotCommandAlias

	result := m.DB.Where("command_alias = ?", commandAlias).Where("discord_server_id", discordServerId).Find(&commandAliasModel)
	if result.Error != nil {
		return nil, errors.New("(CheckCommandAlias) db.Find Error:" + result.Error.Error())
	}

	if len(commandAliasModel) > 0 {
		return &commandAliasModel[0].CommandAlias, nil
	}

	return nil, nil
}

func (m *MySQL) DeleteCommandAlias(ctx context.Context, commandAlias string, discordServerId string) (*string, error) {
	var commandAliasModel *models.BotCommandAlias

	existAlias, err := m.CheckCommandAliasExist(ctx, commandAlias, discordServerId)
	if err != nil {
		return nil, err
	}

	if existAlias == nil {
		var infoText = "the command alias \"" + commandAlias + "\" des not exist"
		return &infoText, nil
	}

	result := m.DB.Where("command_alias = ?", commandAlias).Where("discord_server_id = ?", discordServerId).First(&commandAliasModel)
	if result.Error != nil {
		return nil, errors.New("(DeleteCommandAlias) db.First Error:" + result.Error.Error())
	}

	result = m.DB.Delete(&commandAliasModel)
	if result.Error != nil {
		return nil, errors.New("(DeleteCommandAlias) db.Delete Error:" + result.Error.Error())
	}

	return nil, nil
}

// COMMAND ALIAS

package postgresql

import (
	"context"
	"errors"
	"log"
	"time"

	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/platform"
)

func (m *postgresql) SetDiscordBotConfig(ctx context.Context, serverId, key, value string) (bool, error) {
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

func (m *postgresql) GetDiscordBotConfig(ctx context.Context, serverId, key string) (*models.DiscordBotConfigs, error) {
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

func (m *postgresql) DeleteDiscordBotConfig(ctx context.Context, serverId, key string) (bool, error) {
	existConfig, err := m.GetDiscordBotConfig(ctx, serverId, key)
	if err != nil {
		return false, err
	}

	if existConfig == nil {
		return false, nil
	}

	result := m.DB.Model(&existConfig).Updates(map[string]interface{}{"config_value": ""})
	if result.Error != nil {
		return false, errors.New("(DeleteDicordBotConfig) db.Updates Error:" + result.Error.Error())
	}

	return true, nil
}

func (m *postgresql) AddAnnouncementChannel(ctx context.Context, channelId, serverId, createdBy string) (bool, error) {
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

func (m *postgresql) GetAnnouncementChannels(ctx context.Context) ([]*models.DiscordAnnouncementChannels, error) {
	var announcementChs []*models.DiscordAnnouncementChannels

	result := m.DB.Find(&announcementChs)
	if result.Error != nil {
		return nil, errors.New("(GetAnnouncementChannels) db.Find Error:" + result.Error.Error())
	}

	return announcementChs, nil
}

func (m *postgresql) GetAnnouncementChannelByChannelId(ctx context.Context, channelId string) (*models.DiscordAnnouncementChannels, error) {
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

func (m *postgresql) GetAnnouncementChannelById(ctx context.Context, id int) (*models.DiscordAnnouncementChannels, error) {
	var announcementChs models.DiscordAnnouncementChannels

	result := m.DB.Where("id = ?", id).First(&announcementChs)
	if result.Error != nil {
		return nil, errors.New("(GetAnnouncementChannel) db.Find Error:" + result.Error.Error())
	}
	return &announcementChs, nil
}

func (m *postgresql) DeleteAnnouncementChannel(ctx context.Context, channelId string) (bool, error) {
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

func (m *postgresql) AddDiscordTwitchLiveAnnos(ctx context.Context, twitchUsername, twitchUserId, annoChannelId, annoServerId, createdBy string) (bool, error) {
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

func (m *postgresql) UpdateTwitchStreamerAnnoContent(ctx context.Context, twitchUserId, annoServerId string, annoContent *string) (bool, error) {
	twitchLiveAnno, err := m.GetDiscordTwitchLiveAnnoByUserId(ctx, twitchUserId, annoServerId)
	if err != nil {
		return false, errors.New("(UpdateTwitchStreamerAnnoContent) Error:" + err.Error())
	}

	if twitchLiveAnno != nil {
		result := m.DB.Model(&twitchLiveAnno).Select("anno_content").Updates(models.DiscordTwitchLiveAnnos{
			AnnoContent: annoContent,
		})
		if result.Error != nil {
			return false, errors.New("(UpdateTwitchStreamerAnnoContent) db.Updates Error:" + result.Error.Error())
		}

		return true, nil
	}

	return false, nil
}

func (m *postgresql) UpdateTwitchStreamerLastAnnoDate(ctx context.Context, twitchUserId, annoServerId string, lastAnnoDate time.Time) (bool, error) {

	twitchLiveAnno, err := m.GetDiscordTwitchLiveAnnoByUserId(ctx, twitchUserId, annoServerId)
	if err != nil {
		return false, errors.New("(UpdateTwitchStreamerLastAnnoDate) Error:" + err.Error())
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

func (m *postgresql) GetTwitchStreamerLastAnnoDate(ctx context.Context, twitchUserId, annoServerId string) (*time.Time, error) {

	twitchLiveAnno, err := m.GetDiscordTwitchLiveAnnoByUserId(ctx, twitchUserId, annoServerId)
	if err != nil {
		return nil, errors.New("(CheckTwitchStreamerLastAnnoDate) Error:" + err.Error())
	}
	if twitchLiveAnno != nil {
		return twitchLiveAnno.LastAnnoDate, nil
	}

	return nil, nil
}

func (m *postgresql) GetTwitchStreamerAnnoContent(ctx context.Context, twitchUserId, annoServerId string) (*string, error) {
	var twitchLiveAnnos []models.DiscordTwitchLiveAnnos

	result := m.DB.Select("anno_content").Where("twitch_user_id = ?", twitchUserId).Where("anno_server_id = ?", annoServerId).Find(&twitchLiveAnnos)
	if result.Error != nil {
		return nil, errors.New("(GetTwitchStreamerAnnoContent) db.Find Error:" + result.Error.Error())
	}

	if len(twitchLiveAnnos) == 0 {
		return nil, nil
	}

	return twitchLiveAnnos[0].AnnoContent, nil
}

func (m *postgresql) GetDiscordTwitchLiveAnno(ctx context.Context, twitchUserId, annoServerId string) (*models.DiscordTwitchLiveAnnos, error) {
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

func (m *postgresql) GetDiscordTwitchLiveAnnoByUsername(ctx context.Context, twitchUsername, annoServerId string) (*models.DiscordTwitchLiveAnnos, error) {
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

func (m *postgresql) GetDiscordTwitchLiveAnnoByUserId(ctx context.Context, twitchUserId, annoServerId string) (*models.DiscordTwitchLiveAnnos, error) {
	var twitchLiveAnnos []models.DiscordTwitchLiveAnnos

	result := m.DB.Where("twitch_user_id = ?", twitchUserId).Where("anno_server_id = ?", annoServerId).Find(&twitchLiveAnnos)
	if result.Error != nil {
		return nil, errors.New("(GetDiscordTwitchLiveAnnoByUserId) db.Find Error:" + result.Error.Error())
	}

	if len(twitchLiveAnnos) == 0 {
		return nil, nil
	}

	return &twitchLiveAnnos[0], nil
}

func (m *postgresql) GetDiscordTwitchLiveAnnos(ctx context.Context, serverId string) ([]*models.DiscordTwitchLiveAnnos, error) {
	var twitchLiveAnnos []*models.DiscordTwitchLiveAnnos

	result := m.DB.Where("anno_server_id = ?", serverId).Find(&twitchLiveAnnos)
	if result.Error != nil {
		return nil, errors.New("(GetDiscordTwitchLiveAnnos) db.Find Error:" + result.Error.Error())
	}

	return twitchLiveAnnos, nil
}

func (m *postgresql) GetCountDiscordTwitchLiveAnnosWithoutContent(ctx context.Context, serverId string) (int64, error) {
	var twitchLiveAnnosCount int64

	result := m.DB.Model(&models.DiscordTwitchLiveAnnos{}).Where("anno_server_id = ?", serverId).Where("anno_content IS NULL OR anno_content = ''").Count(&twitchLiveAnnosCount)
	if result.Error != nil {
		return 0, errors.New("(GetCountDiscordTwitchLiveAnnosWithoutContent) db.Count Error:" + result.Error.Error())
	}

	return twitchLiveAnnosCount, nil
}

func (m *postgresql) DeleteDiscordTwitchLiveAnno(ctx context.Context, twitchUserId string, serverId string) (bool, error) {
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

func (m *postgresql) DeleteDiscordTwitchLiveAnnosByGuildId(ctx context.Context, serverId string) (bool, error) {
	var twitchLiveAnnos models.DiscordTwitchLiveAnnos

	result := m.DB.Where("anno_server_id = ?", serverId).Delete(twitchLiveAnnos)
	if result.Error != nil {
		return false, errors.New("(DeleteDiscordTwitchLiveAnnosByGuildId) db.Delete Error:" + result.Error.Error())
	}

	return true, nil
}

func (m *postgresql) DeleteDiscordTwitchLiveAnnosByChannelId(ctx context.Context, channelId string) (bool, error) {
	var twitchLiveAnnos models.DiscordTwitchLiveAnnos

	result := m.DB.Where("anno_channel_id = ?", channelId).Delete(twitchLiveAnnos)
	if result.Error != nil {
		return false, errors.New("(DeleteDiscordTwitchLiveAnnosByChannelId) db.Delete Error:" + result.Error.Error())
	}

	return true, nil
}

func (m *postgresql) GetDiscordChannelTwitchCategoryFilter(ctx context.Context, serverId string, channelId string) ([]*models.DiscordChannelTwitchCategoryFilter, error) {
	var dcTwitchCF []*models.DiscordChannelTwitchCategoryFilter

	result := m.DB.Where("anno_server_id = ?", serverId).Where("anno_channel_id = ?", channelId).Find(&dcTwitchCF)
	if result.Error != nil {
		return nil, errors.New("(GetDiscordChannelTwitchCategoryFilter) db.Find Error:" + result.Error.Error())
	}

	return dcTwitchCF, nil
}

func (m *postgresql) SetDiscordChannelTwitchCategoryFilter(ctx context.Context, annoServerId, annoChannelId, categoryFilterRegex string, conditionType uint, createdBy string) (bool, error) {
	var discordChTwitchCategoryFilter []models.DiscordChannelTwitchCategoryFilter

	dcTwitchCF, err := m.GetDiscordChannelTwitchCategoryFilter(ctx, annoServerId, annoChannelId)
	if err != nil {
		return false, errors.New("(SetDiscordChannelTwitchCategoryFilter) GetDiscordChannelTwitchCategoryFilter Error:" + err.Error())
	}
	if len(dcTwitchCF) > 0 {
		result := m.DB.Model(&dcTwitchCF).Updates(models.DiscordChannelTwitchCategoryFilter{
			AnnoChannelID:       annoChannelId,
			AnnoServerID:        annoServerId,
			CategoryFilterRegex: categoryFilterRegex,
			ConditionType:       conditionType,
		})
		if result.Error != nil {
			return false, errors.New("(SetDiscordChannelTwitchCategoryFilter) db.Updates Error:" + result.Error.Error())
		}

		return true, nil
	}

	discordChTwitchCategoryFilter = append(discordChTwitchCategoryFilter, models.DiscordChannelTwitchCategoryFilter{
		AnnoChannelID:       annoChannelId,
		AnnoServerID:        annoServerId,
		CategoryFilterRegex: categoryFilterRegex,
		ConditionType:       conditionType,
		CreatedBy:           createdBy,
	})

	result := m.DB.Create(&discordChTwitchCategoryFilter)
	if result.Error != nil {
		return false, errors.New("(SetDiscordChannelTwitchCategoryFilter) db.Create Error:" + result.Error.Error())
	}

	return true, nil
}

func (m *postgresql) DeleteDiscordChannelTwitchCategoryFilter(ctx context.Context, serverId string, channelId string) (bool, error) {
	var discordChTwitchCategoryFilter models.DiscordChannelTwitchCategoryFilter

	result := m.DB.Where("anno_server_id = ?", serverId).Where("anno_channel_id = ?", channelId).Delete(discordChTwitchCategoryFilter)
	if result.Error != nil {
		return false, errors.New("(DeleteDiscordChannelTwitchCategoryFilter) db.Delete Error:" + result.Error.Error())
	}

	return true, nil
}

func (m *postgresql) CheckDiscordBotConfig(ctx context.Context, discordServerId string, configKey string, configValue string) bool {
	configData, err := m.GetDiscordBotConfig(ctx, discordServerId, configKey)
	if err != nil {
		log.Println("[postgresql.CheckDiscordBotConfig] GetDiscordBotConfig error:", err.Error())
		return false
	}

	if configData != nil && configData.Value == configValue {
		return true
	}

	return false
}

func (m *postgresql) SaveDiscordBotCommandActivity(context context.Context, activity, discordServerId, commandAuthor, commandAuthorId string) {
	check := m.CheckDiscordBotConfig(context, discordServerId, "bot_activity_enabled", "1")
	if !check {
		return
	}

	if err := m.CreateBotActionActivity(context, platform.DISCORD, activity, discordServerId, commandAuthor, commandAuthorId); err != nil {
		log.Println("[postgresql.SaveDiscordBotCommandActivity] CreateBotActionActivity error:", err.Error())
	}
}

func (m *postgresql) AddServerToDB(ctx context.Context, serverId string, serverName string, serverOwner string) error {
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

func (m *postgresql) GetServers(ctx context.Context) ([]*models.DiscordServer, error) {
	var dcServer []*models.DiscordServer

	result := m.DB.Find(&dcServer)
	if result.Error != nil {
		return nil, errors.New("(GetServers) db.Find Error:" + result.Error.Error())
	}

	return dcServer, nil
}

func (m *postgresql) DeleteServerFromDB(ctx context.Context, serverId string) error {
	var dcServer *models.DiscordServer

	result := m.DB.Where("server_id = ?", serverId).Delete(&dcServer)
	if result.Error != nil {
		return errors.New("(DeleteServerFromDB) db.Delete Error:" + result.Error.Error())
	}

	return nil
}

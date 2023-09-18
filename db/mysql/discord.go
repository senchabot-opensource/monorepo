package mysql

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/platform"
)

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

	result := m.DB.Model(&existConfig).Updates(map[string]interface{}{"config_value": ""})
	if result.Error != nil {
		return false, errors.New("(DeleteDicordBotConfig) db.Updates Error:" + result.Error.Error())
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

func (m *MySQL) UpdateTwitchStreamerAnnoContent(ctx context.Context, twitchUserId, annoServerId string, annoContent *string) (bool, error) {
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

func (m *MySQL) UpdateTwitchStreamerLastAnnoDate(ctx context.Context, twitchUserId, annoServerId string, lastAnnoDate time.Time) (bool, error) {

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

func (m *MySQL) GetTwitchStreamerLastAnnoDate(ctx context.Context, twitchUserId, annoServerId string) (*time.Time, error) {

	twitchLiveAnno, err := m.GetDiscordTwitchLiveAnnoByUserId(ctx, twitchUserId, annoServerId)
	if err != nil {
		return nil, errors.New("(CheckTwitchStreamerLastAnnoDate) Error:" + err.Error())
	}
	if twitchLiveAnno != nil {
		return twitchLiveAnno.LastAnnoDate, nil
	}

	return nil, nil
}

func (m *MySQL) GetTwitchStreamerAnnoContent(ctx context.Context, twitchUserId, annoServerId string) (*string, error) {
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

func (m *MySQL) GetDiscordTwitchLiveAnnoByUserId(ctx context.Context, twitchUserId, annoServerId string) (*models.DiscordTwitchLiveAnnos, error) {
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

func (m *MySQL) CheckDiscordBotConfig(ctx context.Context, discordServerId string, configKey string, configValue string) bool {
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

func (m *MySQL) SaveDiscordBotCommandActivity(context context.Context, activity, discordServerId, commandAuthor, commandAuthorId string) {
	check := m.CheckDiscordBotConfig(context, discordServerId, "bot_activity_enabled", "1")
	if !check {
		return
	}

	if err := m.CreateBotActionActivity(context, platform.DISCORD, activity, discordServerId, commandAuthor, commandAuthorId); err != nil {
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

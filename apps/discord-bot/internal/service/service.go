package service

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/bwmarrin/discordgo"
	"github.com/senchabot-opensource/monorepo/apps/discord-bot/internal/service/webhook"
	"github.com/senchabot-opensource/monorepo/db"
	"github.com/senchabot-opensource/monorepo/db/postgresql"
	botcommandgrpc "github.com/senchabot-opensource/monorepo/grpc/botcommand/client"
	"github.com/senchabot-opensource/monorepo/model"
	"github.com/senchabot-opensource/monorepo/platform"
)

type Service interface {
	BotLeaveWebhook(client *discordgo.Session, w http.ResponseWriter, r *http.Request)

	GetUserBotCommand(ctx context.Context, commandName string, discordServerId string) (*model.BotCommand, error)
	GetGlobalBotCommand(ctx context.Context, commandName string) (*model.BotCommand, error)

	CreateCommand(ctx context.Context, commandName string, commandContent string, discordServerId string, createdBy string) (*string, error)
	CheckCommandExists(ctx context.Context, commandName string, discordServerId string) (*string, error)
	UpdateCommand(ctx context.Context, commandName string, commandContent string, discordServerId string, updatedBy string) (*string, *string, error)
	DeleteCommand(ctx context.Context, commandName string, discordServerId string) (*string, *string, error)
	GetCommandList(ctx context.Context, discordServerId string) ([]*model.BotCommand, error)

	SaveCommandActivity(context context.Context, commandName string, discordServerId string, commandAuthor, commandAuthorId string)

	GetCommandAlias(ctx context.Context, commandAlias string, discordServerId string) (*string, error)
	CreateCommandAlias(ctx context.Context, commandName string, aliases []string, discordServerId string, createdBy string) (*string, error)
	CheckCommandAliasExist(ctx context.Context, commandAlias string, discordServerId string) (*string, error)
	DeleteCommandAlias(ctx context.Context, commandAlias string, discordServerId string) (*string, error)

	AddAnnouncementChannel(ctx context.Context, channelId, serverId, createdBy string) (bool, error)
	GetAnnouncementChannels(ctx context.Context) ([]*model.DiscordAnnouncementChannels, error)
	GetAnnouncementChannelByChannelId(ctx context.Context, channelId string) (*model.DiscordAnnouncementChannels, error)
	GetAnnouncementChannelById(ctx context.Context, id int) (*model.DiscordAnnouncementChannels, error)
	DeleteAnnouncementChannel(ctx context.Context, channelId string) (bool, error)
	AddDiscordTwitchLiveAnnos(ctx context.Context, twitchUsername, twitchUserId, annoChannelId, annoServerId, createdBy string) (bool, error)
	UpdateTwitchStreamerAnnoContent(ctx context.Context, twitchUserId, annoServerId string, annoContent *string) (bool, error)
	UpdateTwitchStreamerLastAnnoDate(ctx context.Context, twitchUserId, annoServerId string, lastAnnoDate time.Time) (bool, error)
	GetTwitchStreamerLastAnnoDate(ctx context.Context, twitchUserId, annoServerId string) (*time.Time, error)
	GetTwitchStreamerAnnoContent(ctx context.Context, twitchUserId, annoServerId string) (*string, error)
	GetDiscordTwitchLiveAnno(ctx context.Context, twitchUserId, annoServerId string) (*model.DiscordTwitchLiveAnnos, error)
	GetDiscordTwitchLiveAnnoByUsername(ctx context.Context, twitchUsername, annoServerId string) (*model.DiscordTwitchLiveAnnos, error)
	GetDiscordTwitchLiveAnnos(ctx context.Context, serverId string) ([]*model.DiscordTwitchLiveAnnos, error)
	GetCountDiscordTwitchLiveAnnosWithoutContent(ctx context.Context, serverId string) (int64, error)
	GetCountDiscordTwitchLiveAnnosWithoutChannel(ctx context.Context, serverId string) (int64, error)
	DeleteDiscordTwitchLiveAnno(ctx context.Context, twitchUserId string, serverId string) (bool, error)
	DeleteDiscordTwitchLiveAnnosByGuildId(ctx context.Context, serverId string) (bool, error)
	DeleteDiscordTwitchLiveAnnosByChannelId(ctx context.Context, channelId string) (bool, error)
	GetDiscordChannelTwitchCategoryFilter(ctx context.Context, serverId string, channelId string) ([]*model.DiscordChannelTwitchCategoryFilter, error)
	SetDiscordChannelTwitchCategoryFilter(ctx context.Context, annoServerId, annoChannelId, categoryFilterRegex string, conditionType uint, createdBy string) (bool, error)
	DeleteDiscordChannelTwitchCategoryFilter(ctx context.Context, serverId string, channelId string) (bool, error)
	AddServerToDB(ctx context.Context, serverId string, serverName string, serverOwner string) error
	DeleteServerFromDB(ctx context.Context, serverId string) error
	GetServers(ctx context.Context) ([]*model.DiscordServer, error)

	SetDiscordBotConfig(ctx context.Context, serverId, key, value string) (bool, error)
	DeleteDiscordBotConfig(ctx context.Context, serverId, key string) (bool, error)
	GetDiscordBotConfig(ctx context.Context, discordServerId string, configKey string) (*model.DiscordBotConfigs, error)
	CheckDiscordBotConfig(ctx context.Context, discordServerId string, configKey string, configValue string) bool

	// Command Variable methods
	GetCommandVariable(ctx context.Context, varName string, botPlatformId string) (*model.BotCommandVariable, error)
	CreateCommandVariable(ctx context.Context, varName string, varContent string, botPlatformId string, createdBy string) error
	UpdateCommandVariable(ctx context.Context, varName string, varContent string, botPlatformId string, updatedBy string) error
	DeleteCommandVariable(ctx context.Context, varName string, botPlatformId string, updatedBy string) error
	ListCommandVariables(ctx context.Context, botPlatformId string) ([]*model.BotCommandVariable, error)
	GetCustomVariableContent(ctx context.Context, botPlatformId string, varName string) string

	GetDiscordUserPrivacyPreferences(ctx context.Context, discordUserId string) (*model.DiscordUserPrivacyPreferences, error)
	SetDiscordUserPrivacyPreferences(ctx context.Context, discordUserId string, doNotTrackMessages bool) error
}

type service struct {
	db               db.Database
	botCommandClient *botcommandgrpc.BotCommandClient
	Webhook          webhook.Webhook
}

func New(botCommandClient *botcommandgrpc.BotCommandClient) Service {
	dbService := postgresql.New()
	whService := webhook.NewWebhook(dbService)

	return &service{
		db:               dbService,
		botCommandClient: botCommandClient,
		Webhook:          whService,
	}
}

func (s *service) BotLeaveWebhook(client *discordgo.Session, w http.ResponseWriter, r *http.Request) {
	s.Webhook.BotLeave(client, w, r)
}

func (s *service) GetUserBotCommand(ctx context.Context, commandName string, discordServerId string) (*model.BotCommand, error) {
	cmd, err := s.botCommandClient.GetUserBotCommand(ctx, platform.DISCORD.String(), commandName, discordServerId)
	if err != nil {
		return nil, err
	}
	if cmd == nil {
		return nil, nil
	}
	return &model.BotCommand{
		ID:             int(cmd.Id),
		CommandName:    cmd.CommandName,
		CommandContent: cmd.CommandContent,
		CommandType:    int(cmd.CommandType),
		Status:         int(cmd.Status),
	}, nil
}

func (s *service) GetGlobalBotCommand(ctx context.Context, commandName string) (*model.BotCommand, error) {
	cmd, err := s.botCommandClient.GetGlobalBotCommand(ctx, commandName)
	if err != nil {
		return nil, err
	}
	if cmd == nil {
		return nil, nil
	}
	return &model.BotCommand{
		ID:             int(cmd.Id),
		CommandName:    cmd.CommandName,
		CommandContent: cmd.CommandContent,
		CommandType:    int(cmd.CommandType),
		Status:         int(cmd.Status),
	}, nil
}

func (s *service) CreateCommand(ctx context.Context, commandName string, commandContent string, discordServerId string, createdBy string) (*string, error) {
	resp, err := s.botCommandClient.CreateBotCommand(ctx, platform.DISCORD.String(), commandName, commandContent, discordServerId, createdBy)
	if err != nil {
		return nil, err
	}
	return &resp.InfoText, nil
}

func (s *service) CheckCommandExists(ctx context.Context, commandName string, discordServerId string) (*string, error) {
	cmd, err := s.botCommandClient.GetUserBotCommand(ctx, platform.DISCORD.String(), commandName, discordServerId)
	if err != nil {
		return nil, err
	}
	if cmd == nil {
		return nil, nil
	}
	return &cmd.CommandName, nil
}

func (s *service) UpdateCommand(ctx context.Context, commandName string, commandContent string, discordServerId string, updatedBy string) (*string, *string, error) {
	resp, err := s.botCommandClient.UpdateBotCommand(ctx, platform.DISCORD.String(), commandName, commandContent, discordServerId, updatedBy)
	if err != nil {
		return nil, nil, err
	}
	return &resp.CommandName, &resp.InfoText, nil
}

func (s *service) DeleteCommand(ctx context.Context, commandName string, discordServerId string) (*string, *string, error) {
	resp, err := s.botCommandClient.DeleteBotCommand(ctx, platform.DISCORD.String(), commandName, discordServerId)
	if err != nil {
		return nil, nil, err
	}
	return &resp.CommandName, &resp.InfoText, nil
}

func (s *service) GetCommandList(ctx context.Context, discordServerId string) ([]*model.BotCommand, error) {
	cmds, err := s.botCommandClient.GetCommandList(ctx, platform.DISCORD.String(), discordServerId)
	if err != nil {
		return nil, err
	}
	var result []*model.BotCommand
	for _, cmd := range cmds {
		result = append(result, &model.BotCommand{
			ID:             int(cmd.Id),
			CommandName:    cmd.CommandName,
			CommandContent: cmd.CommandContent,
			CommandType:    int(cmd.CommandType),
			Status:         int(cmd.Status),
		})
	}
	return result, nil
}

func (s *service) SaveCommandActivity(context context.Context, commandName string, discordServerId string, commandAuthor, commandAuthorId string) {
	check := s.CheckDiscordBotConfig(context, discordServerId, "bot_activity_enabled", "1")
	if !check {
		return
	}

	commandName = "/" + commandName

	if err := s.db.CreateBotActionActivity(context, platform.DISCORD, commandName, discordServerId, commandAuthor, commandAuthorId); err != nil {
		log.Println("[service.SaveCommandActivity] CreateBotActionActivity error:", err.Error())
	}
}

func (s *service) CreateCommandAlias(ctx context.Context, commandName string, aliases []string, discordServerId string, createdBy string) (*string, error) {
	resp, err := s.botCommandClient.CreateCommandAlias(ctx, platform.DISCORD.String(), commandName, aliases, discordServerId, createdBy)
	if err != nil {
		return nil, err
	}
	return &resp.InfoText, nil
}
func (s *service) GetCommandAlias(ctx context.Context, commandAlias string, discordServerId string) (*string, error) {
	commandName, err := s.botCommandClient.GetCommandAlias(ctx, platform.DISCORD.String(), commandAlias, discordServerId)
	if err != nil {
		return nil, err
	}
	return &commandName, nil
}
func (s *service) CheckCommandAliasExist(ctx context.Context, commandAlias string, discordServerId string) (*string, error) {
	commandName, err := s.botCommandClient.GetCommandAlias(ctx, platform.DISCORD.String(), commandAlias, discordServerId)
	if err != nil {
		return nil, err
	}
	if commandName == "" {
		return nil, nil
	}
	return &commandName, nil
}
func (s *service) DeleteCommandAlias(ctx context.Context, commandAlias string, discordServerId string) (*string, error) {
	resp, err := s.botCommandClient.DeleteCommandAlias(ctx, platform.DISCORD.String(), commandAlias, discordServerId)
	if err != nil {
		return nil, err
	}
	return &resp.InfoText, nil
}

// Discord

func (s *service) AddAnnouncementChannel(ctx context.Context, channelId string, serverId string, createdBy string) (bool, error) {
	return s.db.AddAnnouncementChannel(ctx, channelId, serverId, createdBy)
}
func (s *service) GetAnnouncementChannels(ctx context.Context) ([]*model.DiscordAnnouncementChannels, error) {
	return s.db.GetAnnouncementChannels(ctx)
}
func (s *service) GetAnnouncementChannelByChannelId(ctx context.Context, channelId string) (*model.DiscordAnnouncementChannels, error) {
	return s.db.GetAnnouncementChannelByChannelId(ctx, channelId)
}
func (s *service) GetAnnouncementChannelById(ctx context.Context, id int) (*model.DiscordAnnouncementChannels, error) {
	return s.db.GetAnnouncementChannelById(ctx, id)
}
func (s *service) DeleteAnnouncementChannel(ctx context.Context, channelId string) (bool, error) {
	return s.db.DeleteAnnouncementChannel(ctx, channelId)
}
func (s *service) AddDiscordTwitchLiveAnnos(ctx context.Context, twitchUsername, twitchUserId, annoChannelId, annoServerId, createdBy string) (bool, error) {
	return s.db.AddDiscordTwitchLiveAnnos(ctx, twitchUsername, twitchUserId, annoChannelId, annoServerId, createdBy)
}
func (s *service) UpdateTwitchStreamerAnnoContent(ctx context.Context, twitchUserId, annoServerId string, annoContent *string) (bool, error) {
	return s.db.UpdateTwitchStreamerAnnoContent(ctx, twitchUserId, annoServerId, annoContent)
}
func (s *service) UpdateTwitchStreamerLastAnnoDate(ctx context.Context, twitchUserId, annoServerId string, lastAnnoDate time.Time) (bool, error) {
	return s.db.UpdateTwitchStreamerLastAnnoDate(ctx, twitchUserId, annoServerId, lastAnnoDate)
}
func (s *service) GetTwitchStreamerLastAnnoDate(ctx context.Context, twitchUserId, annoServerId string) (*time.Time, error) {
	return s.db.GetTwitchStreamerLastAnnoDate(ctx, twitchUserId, annoServerId)
}
func (s *service) GetTwitchStreamerAnnoContent(ctx context.Context, twitchUserId, annoServerId string) (*string, error) {
	return s.db.GetTwitchStreamerAnnoContent(ctx, twitchUserId, annoServerId)
}
func (s *service) GetDiscordTwitchLiveAnno(ctx context.Context, twitchUserId, annoServerId string) (*model.DiscordTwitchLiveAnnos, error) {
	return s.db.GetDiscordTwitchLiveAnno(ctx, twitchUserId, annoServerId)
}
func (s *service) GetDiscordTwitchLiveAnnoByUsername(ctx context.Context, twitchUsername, annoServerId string) (*model.DiscordTwitchLiveAnnos, error) {
	return s.db.GetDiscordTwitchLiveAnnoByUsername(ctx, twitchUsername, annoServerId)
}
func (s *service) GetDiscordTwitchLiveAnnos(ctx context.Context, serverId string) ([]*model.DiscordTwitchLiveAnnos, error) {
	return s.db.GetDiscordTwitchLiveAnnos(ctx, serverId)
}
func (s *service) GetCountDiscordTwitchLiveAnnosWithoutContent(ctx context.Context, serverId string) (int64, error) {
	return s.db.GetCountDiscordTwitchLiveAnnosWithoutContent(ctx, serverId)
}
func (s *service) GetCountDiscordTwitchLiveAnnosWithoutChannel(ctx context.Context, serverId string) (int64, error) {
	return s.db.GetCountDiscordTwitchLiveAnnosWithoutChannel(ctx, serverId)
}
func (s *service) DeleteDiscordTwitchLiveAnno(ctx context.Context, twitchUserId string, serverId string) (bool, error) {
	return s.db.DeleteDiscordTwitchLiveAnno(ctx, twitchUserId, serverId)
}
func (s *service) DeleteDiscordTwitchLiveAnnosByGuildId(ctx context.Context, serverId string) (bool, error) {
	return s.db.DeleteDiscordTwitchLiveAnnosByGuildId(ctx, serverId)
}
func (s *service) DeleteDiscordTwitchLiveAnnosByChannelId(ctx context.Context, channelId string) (bool, error) {
	// TODO: Delete streamers from streamers data
	return s.db.DeleteDiscordTwitchLiveAnnosByChannelId(ctx, channelId)
}
func (s *service) GetDiscordChannelTwitchCategoryFilter(ctx context.Context, serverId string, channelId string) ([]*model.DiscordChannelTwitchCategoryFilter, error) {
	return s.db.GetDiscordChannelTwitchCategoryFilter(ctx, serverId, channelId)
}
func (s *service) SetDiscordChannelTwitchCategoryFilter(ctx context.Context, annoServerId, annoChannelId, categoryFilterRegex string, conditionType uint, createdBy string) (bool, error) {
	return s.db.SetDiscordChannelTwitchCategoryFilter(ctx, annoServerId, annoChannelId, categoryFilterRegex, conditionType, createdBy)
}
func (s *service) DeleteDiscordChannelTwitchCategoryFilter(ctx context.Context, serverId string, channelId string) (bool, error) {
	return s.db.DeleteDiscordChannelTwitchCategoryFilter(ctx, serverId, channelId)
}
func (s *service) AddServerToDB(ctx context.Context, serverId string, serverName string, serverOwner string) error {
	return s.db.AddServerToDB(ctx, serverId, serverName, serverOwner)
}
func (s *service) DeleteServerFromDB(ctx context.Context, serverId string) error {
	return s.db.DeleteServerFromDB(ctx, serverId)
}
func (s *service) GetServers(ctx context.Context) ([]*model.DiscordServer, error) {
	return s.db.GetServers(ctx)
}

// DISCORD BOT CONFIG
func (s *service) SetDiscordBotConfig(ctx context.Context, serverId, key, value string) (bool, error) {
	return s.db.SetDiscordBotConfig(ctx, serverId, key, value)
}
func (s *service) DeleteDiscordBotConfig(ctx context.Context, serverId string, key string) (bool, error) {
	return s.db.DeleteDiscordBotConfig(ctx, serverId, key)
}
func (s *service) GetDiscordBotConfig(ctx context.Context, discordServerId string, configKey string) (*model.DiscordBotConfigs, error) {
	return s.db.GetDiscordBotConfig(ctx, discordServerId, configKey)
}
func (s *service) CheckDiscordBotConfig(ctx context.Context, discordServerId string, configKey string, configValue string) bool {
	configData, err := s.db.GetDiscordBotConfig(ctx, discordServerId, configKey)
	if err != nil {
		log.Println("[service.CheckDiscordBotConfig] GetDiscordBotConfig error:", err.Error())
		return false
	}

	if configData != nil && configData.Value == configValue {
		return true
	}

	return false
}

// DISCORD BOT CONFIG

func (s *service) GetCommandVariable(ctx context.Context, varName string, botPlatformId string) (*model.BotCommandVariable, error) {
	return s.db.GetCommandVariable(ctx, varName, platform.DISCORD, botPlatformId)
}

func (s *service) CreateCommandVariable(ctx context.Context, varName string, varContent string, botPlatformId string, createdBy string) error {
	return s.db.CreateCommandVariable(ctx, varName, varContent, platform.DISCORD, botPlatformId, createdBy)
}

func (s *service) UpdateCommandVariable(ctx context.Context, varName string, varContent string, botPlatformId string, updatedBy string) error {
	return s.db.UpdateCommandVariable(ctx, varName, varContent, platform.DISCORD, botPlatformId, updatedBy)
}

func (s *service) DeleteCommandVariable(ctx context.Context, varName string, botPlatformId string, updatedBy string) error {
	return s.db.DeleteCommandVariable(ctx, varName, platform.DISCORD, botPlatformId, updatedBy)
}

func (s *service) ListCommandVariables(ctx context.Context, botPlatformId string) ([]*model.BotCommandVariable, error) {
	return s.db.ListCommandVariables(ctx, platform.DISCORD, botPlatformId)
}

func (s *service) GetCustomVariableContent(ctx context.Context, botPlatformId string, varName string) string {
	return s.db.GetCustomVariableContent(ctx, platform.DISCORD, botPlatformId, varName)
}

func (s *service) GetDiscordUserPrivacyPreferences(ctx context.Context, discordUserId string) (*model.DiscordUserPrivacyPreferences, error) {
	return s.db.GetDiscordUserPrivacyPreferences(ctx, discordUserId)
}

func (s *service) SetDiscordUserPrivacyPreferences(ctx context.Context, discordUserId string, doNotTrackMessages bool) error {
	return s.db.SetDiscordUserPrivacyPreferences(ctx, discordUserId, doNotTrackMessages)
}

package service

import (
	"errors"

	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
	"gorm.io/gorm"
)

type Service interface {
	GetTwitchChannels() ([]*models.TwitchChannel, error)
	GetBotActionActivities() ([]*models.BotActionActivity, error)
	GetBotCommandAliases() ([]*models.BotCommandAlias, error)
	GetBotCommands() ([]*models.BotCommand, error)
}

type service struct {
	Db *gorm.DB
}

var _ Service = &service{}

func New(db *gorm.DB) Service {
	return &service{
		Db: db,
	}
}

func (s *service) GetTwitchChannels() ([]*models.TwitchChannel, error) {
	var twitchChannels []*models.TwitchChannel

	result := s.Db.Find(&twitchChannels)
	if result.Error != nil {
		return nil, errors.New("(GetTwitchChannels) db.Find Error:" + result.Error.Error())
	}

	return twitchChannels, nil
}

func (s *service) GetBotActionActivities() ([]*models.BotActionActivity, error) {
	var model []*models.BotActionActivity

	result := s.Db.Find(&model)
	if result.Error != nil {
		return nil, errors.New("(GetBotActionActivities) db.Find Error:" + result.Error.Error())
	}

	return model, nil
}
func (s *service) GetBotCommandAliases() ([]*models.BotCommandAlias, error) {
	var model []*models.BotCommandAlias

	result := s.Db.Find(&model)
	if result.Error != nil {
		return nil, errors.New("(GetBotCommandAliases) db.Find Error:" + result.Error.Error())
	}

	return model, nil
}
func (s *service) GetBotCommands() ([]*models.BotCommand, error) {
	var botCommands []*models.BotCommand

	result := s.Db.Find(&botCommands)
	if result.Error != nil {
		return nil, errors.New("(GetBotCommands) db.Find Error:" + result.Error.Error())
	}

	return botCommands, nil
}

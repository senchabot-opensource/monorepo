package postgresql

import (
	"context"
	"errors"
	"log"

	"github.com/senchabot-opensource/monorepo/model"
	"gorm.io/gorm"
)

// add streamer exist in community check
func (m *postgresql) CheckStreamerExistInCommunity(ctx context.Context, communityId uint, channelId string) (bool, error) {
	var existing model.TwitchCommunityMember
	result := m.DB.Where("community_id = ? AND member_channel_id = ?", communityId, channelId).First(&existing)
	if result.Error == nil {
		return true, nil
	}
	return false, nil
}

func (m *postgresql) AddStreamerToTwitchCommunity(ctx context.Context, communityId uint, channelId string) error {
	// Check if streamer is already in the community

	// Add streamer to community
	community := model.TwitchCommunityMember{
		CommunityID:     communityId,
		MemberChannelID: channelId,
	}

	result := m.DB.Create(&community)
	if result.Error != nil {
		return errors.New("(AddStreamerToCommunity) db.Create Error: " + result.Error.Error())
	}

	return nil
}

func (m *postgresql) SubscribeToTwitchCommunity(ctx context.Context, communityId uint, channelId string) error {
	var existing model.TwitchCommunitySubscription
	result := m.DB.Where("community_id = ? AND channel_id = ?", communityId, channelId).First(&existing)
	if result.Error == nil {
		return errors.New("channel already subscribed to this community")
	}

	// Add subscription
	subscription := model.TwitchCommunitySubscription{
		CommunityID: communityId,
		ChannelID:   channelId,
	}

	result = m.DB.Create(&subscription)
	if result.Error != nil {
		return errors.New("(postgresql.SubscribeToCommunity) db.Create Error: " + result.Error.Error())
	}

	return nil
}

func (m *postgresql) GetTwitchCommunitySubscription(ctx context.Context, channelId string) (*model.TwitchCommunitySubscription, error) {
	var twitchCommunitySubscription model.TwitchCommunitySubscription
	result := m.DB.Where("channel_id = ?", channelId).First(&twitchCommunitySubscription)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, errors.New("(postgresql.GetTwitchCommunitySubscription) db.First Error: " + result.Error.Error())
	}

	return &twitchCommunitySubscription, nil
}

func (m *postgresql) GetStreamersFromTwitchCommunity(ctx context.Context, communityId uint) ([]string, error) {
	var communityStreamers []model.TwitchCommunityMember
	result := m.DB.Where("community_id = ?", communityId).Find(&communityStreamers)
	if result.Error != nil {
		return nil, errors.New("(postgresql.GetStreamersFromCommunity) db.Find Error: " + result.Error.Error())
	}

	streamerIds := make([]string, len(communityStreamers))
	for i, gs := range communityStreamers {
		streamerIds[i] = gs.MemberChannelID
	}

	return streamerIds, nil
}

// Additional helper methods

func (m *postgresql) RemoveStreamerFromTwitchCommunity(ctx context.Context, communityId uint, streamerId string) error {
	result := m.DB.Where("community_id = ? AND member_channel_id = ?", communityId, streamerId).Delete(&model.TwitchCommunityMember{})
	if result.Error != nil {
		return errors.New("(postgresql.RemoveStreamerFromCommunity) db.Delete Error: " + result.Error.Error())
	}
	return nil
}

func (m *postgresql) UnsubscribeFromTwitchCommunity(ctx context.Context, communityId uint, channelId string) error {
	result := m.DB.Where("community_id = ? AND channel_id = ?", communityId, channelId).Delete(&model.TwitchCommunitySubscription{})
	if result.Error != nil {
		return errors.New("(postgresql.UnsubscribeFromCommunity) db.Delete Error: " + result.Error.Error())
	}
	return nil
}

func (m *postgresql) GetTwitchCommunity(ctx context.Context, communityName string) (*model.TwitchCommunity, error) {
	var community model.TwitchCommunity
	result := m.DB.Where("community_name = ?", communityName).First(&community)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, errors.New("(postgresql.GetTwitchCommunity) db.First Error: " + result.Error.Error())
	}
	return &community, nil
}

func (m *postgresql) CreateTwitchCommunity(ctx context.Context, communityName string, creatorChannelId string) (*model.TwitchCommunity, error) {
	community := model.TwitchCommunity{
		CommunityName:    communityName,
		CreatorChannelID: creatorChannelId,
	}

	result := m.DB.Create(&community)
	if result.Error != nil {
		return nil, errors.New("(postgresql.CreateTwitchCommunity) db.Create Error: " + result.Error.Error())
	}

	return &community, nil
}

func (m *postgresql) GetAllTwitchCommunitySubscriptions(ctx context.Context, channelId string) ([]*model.TwitchCommunitySubscription, error) {
	var subscriptions []*model.TwitchCommunitySubscription
	result := m.DB.Where("channel_id = ?", channelId).Find(&subscriptions)
	if result.Error != nil {
		return nil, errors.New("(postgresql.GetAllTwitchCommunitySubscriptions) db.Find Error: " + result.Error.Error())
	}
	return subscriptions, nil
}

func (m *postgresql) GetAllTwitchCommunityMembers(ctx context.Context, communityId uint) ([]*model.TwitchCommunityMember, error) {
	var members []*model.TwitchCommunityMember
	result := m.DB.Where("community_id = ?", communityId).Find(&members)
	if result.Error != nil {
		return nil, errors.New("(postgresql.GetAllTwitchCommunityMembers) db.Find Error: " + result.Error.Error())
	}
	return members, nil
}

func (m *postgresql) GetTwitchCommunityById(ctx context.Context, communityId uint) (*model.TwitchCommunity, error) {
	var community model.TwitchCommunity
	result := m.DB.Where("id = ?", communityId).First(&community)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, errors.New("(postgresql.GetTwitchCommunityById) db.First Error: " + result.Error.Error())
	}
	return &community, nil
}

func (m *postgresql) GetTwitchCommunityByCreatorId(ctx context.Context, channelId string) (*model.TwitchCommunity, error) {
	var community model.TwitchCommunity

	log.Println("[postgresql.GetTwitchCommunityByCreatorId] channelId:", channelId)
	result := m.DB.Where("creator_channel_id = ?", channelId).First(&community)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, errors.New("(postgresql.GetTwitchCommunityByCreatorId) db.First Error: " + result.Error.Error())
	}
	return &community, nil
}

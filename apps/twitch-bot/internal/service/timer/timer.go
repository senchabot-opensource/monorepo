package timer

import (
	"strconv"
	"sync/atomic"
	"time"

	"github.com/senchabot-opensource/monorepo/apps/twitch-bot/client"
	"github.com/senchabot-opensource/monorepo/packages/gosenchabot/models"
)

type Timer interface {
	SetTimer(client *client.Clients, channelName string, commandData *models.BotCommand, interval int)
	SetTimerEnabled(client *client.Clients, commandId int)
	SetTimerDisabled(commandId int)
	GetTimerStatus(commandId int) bool
	DeleteTimer(commandId int)
	UpdateTimerContent(commandId int, commandContent string)
	UpdateCommandTimerInterval(commandId, interval int)
}

type TimerData struct {
	enabled     uint32 // 0 for disabled, 1 for enabled
	channelName string
	commandData *models.BotCommand
	interval    int
	tickerCh    chan struct{} // channel to signal ticker to stop
}

type timerManager struct {
	timers map[int]*TimerData
}

var manager *timerManager

func initTimer() {
	manager = &timerManager{
		timers: make(map[int]*TimerData),
	}
}

type timer struct{}

func NewTimer() Timer {
	initTimer()
	return &timer{}
}

func (t *TimerData) NewTimerMessage(client *client.Clients) {
	ticker := time.NewTicker(time.Duration(t.interval) * time.Millisecond)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			if atomic.LoadUint32(&t.enabled) == 0 {
				return
			}
			client.Twitch.Say(t.channelName, t.commandData.CommandContent)
		case <-t.tickerCh: // signal to stop the ticker
			return
		}
	}
}

func (t *timer) SetTimerEnabled(client *client.Clients, commandId int) {
	if timerData, ok := manager.timers[commandId]; ok {
		atomic.StoreUint32(&timerData.enabled, 1)
		//go timerData.NewTimerMessage(client)
		go manager.timers[commandId].NewTimerMessage(client)
	}
}

func (t *timer) SetTimerDisabled(commandId int) {
	if timerData, ok := manager.timers[commandId]; ok {
		atomic.StoreUint32(&timerData.enabled, 0)
		if timerData.tickerCh != nil {
			close(timerData.tickerCh) // stop the ticker
		}
	}
}

func (t *timer) GetTimerStatus(commandId int) bool {
	if timerData, ok := manager.timers[commandId]; ok {
		return atomic.LoadUint32(&timerData.enabled) == 1
	}
	return false
}

func (t *timer) UpdateTimerContent(commandId int, commandContent string) {
	if timerData, ok := manager.timers[commandId]; ok {
		timerData.commandData.CommandContent = commandContent
	}
}

func (t *timer) UpdateCommandTimerInterval(commandId, interval int) {
	if timerData, ok := manager.timers[commandId]; ok {
		timerData.interval = interval
		if timerData.tickerCh != nil {
			close(timerData.tickerCh)
		}
		timerData.tickerCh = make(chan struct{})
		//go timerData.NewTimerMessage(client)
	}
}

func (t *timer) SetTimer(client *client.Clients, channelName string, commandData *models.BotCommand, interval int) {
	if timerData, ok := manager.timers[commandData.ID]; ok {
		atomic.StoreUint32(&timerData.enabled, 1)
		timerData.channelName = channelName
		timerData.commandData = commandData
		timerData.interval = interval
		client.Twitch.Say(channelName, "Reset the command \""+commandData.CommandName+"\" timer interval to "+strconv.Itoa(interval/60000)+" minutes.")
	} else {
		manager.timers[commandData.ID] = &TimerData{
			enabled:     1,
			channelName: channelName,
			commandData: commandData,
			interval:    interval,
		}
		go manager.timers[commandData.ID].NewTimerMessage(client)
	}
}

func (t *timer) DeleteTimer(commandId int) {
	if timerData, ok := manager.timers[commandId]; ok {
		delete(manager.timers, commandId)
		if timerData.tickerCh != nil {
			close(timerData.tickerCh) // stop the ticker
		}
	}
}

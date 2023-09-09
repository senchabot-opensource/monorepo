package timer

import (
	"fmt"
	"strconv"
	"sync"
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
	NewTimerMessage(client *client.Clients)
	UpdateTimerContent(commandId int, commandContent string)
}

type TimerData struct {
	enabled     bool
	channelName string
	commandData *models.BotCommand
	interval    int
}

type timer struct {
	timerData TimerData
	timerCh   chan struct{}
}

type timerManager struct {
	timers map[int]*TimerData
	mutex  sync.Mutex
}

var manager *timerManager

func initTimer() {
	manager = &timerManager{
		timers: make(map[int]*TimerData),
	}
}

func NewTimer() Timer {
	initTimer()
	return &timer{
		timerCh: make(chan struct{}),
	}
}

func (t *timer) NewTimerMessage(client *client.Clients) {
	for t.timerData.enabled {
		fmt.Println("channel", t.timerData.channelName)
		time.Sleep(time.Duration(t.timerData.interval * int(time.Millisecond)))
		client.Twitch.Say(t.timerData.channelName, t.timerData.commandData.CommandContent)
	}

	close(t.timerCh)

	client.Twitch.Say(t.timerData.channelName, "Command Timer Disabled: "+t.timerData.commandData.CommandName)
}

func (t *timer) SetTimerEnabled(client *client.Clients, commandId int) {
	manager.mutex.Lock()
	defer manager.mutex.Unlock()

	if timerData, ok := manager.timers[commandId]; ok {
		newTimer := &timer{
			timerData: TimerData{
				enabled:     true,
				channelName: timerData.channelName,
				commandData: timerData.commandData,
				interval:    timerData.interval,
			},
			timerCh: make(chan struct{}),
		}
		manager.timers[commandId] = &newTimer.timerData

		go newTimer.NewTimerMessage(client)
	}
}

func (t *timer) SetTimerDisabled(commandId int) {
	manager.mutex.Lock()
	defer manager.mutex.Unlock()

	if timerData, ok := manager.timers[commandId]; ok {
		timerData.enabled = false
	}
}

func (t *timer) GetTimerStatus(commandId int) bool {
	manager.mutex.Lock()
	defer manager.mutex.Unlock()

	if timerData, ok := manager.timers[commandId]; ok {
		return timerData.enabled
	}

	return false
}

func (t *timer) UpdateTimerContent(commandId int, commandContent string) {
	manager.mutex.Lock()
	defer manager.mutex.Unlock()

	if timerData, ok := manager.timers[commandId]; ok {
		timerData.commandData.CommandContent = commandContent
		manager.timers[commandId] = timerData
	}
}

func (t *timer) SetTimer(client *client.Clients, channelName string, commandData *models.BotCommand, interval int) {
	manager.mutex.Lock()
	defer manager.mutex.Unlock()

	if timerData, ok := manager.timers[commandData.ID]; ok {
		timerData.enabled = true
		timerData.commandData = commandData
		timerData.interval = interval
		manager.timers[commandData.ID] = timerData
		client.Twitch.Say(channelName, "Reset the command \""+commandData.CommandName+"\" timer interval to "+strconv.Itoa(interval/60000)+" minutes.")
	} else {
		newTimer := &timer{
			timerData: TimerData{
				enabled:     true,
				channelName: channelName,
				commandData: commandData,
				interval:    interval,
			},
			timerCh: make(chan struct{}),
		}
		manager.timers[commandData.ID] = &newTimer.timerData

		go newTimer.NewTimerMessage(client)
	}

	go func() {
		select {
		case <-t.timerCh:
			manager.mutex.Lock()
			defer manager.mutex.Unlock()

			delete(manager.timers, commandData.ID)
		}
	}()
}

func (t *timer) DeleteTimer(commandId int) {
	delete(manager.timers, commandId)
}

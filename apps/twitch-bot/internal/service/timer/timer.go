package timer

import (
	"fmt"
	"sync"
	"time"

	"github.com/senchabot-dev/monorepo/apps/twitch-bot/client"
)

type Timer interface {
	SetTimer(client *client.Clients, channel string, message string, interval int)
	SetTimerEnabled(client *client.Clients, channel string)
	SetTimerDisabled(channel string)
	GetTimerStatus(channel string) bool
	NewTimerMessage(client *client.Clients)
}

type TimerData struct {
	enabled  bool
	channel  string
	message  string
	interval int
}

type timer struct {
	timerData TimerData
	timerCh   chan struct{}
}

type timerManager struct {
	timers map[string]*TimerData
	mutex  sync.Mutex
}

var manager *timerManager

func initTimer() {
	manager = &timerManager{
		timers: make(map[string]*TimerData),
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
		fmt.Println("channel", t.timerData.channel)
		time.Sleep(time.Duration(t.timerData.interval * int(time.Millisecond)))
		client.Twitch.Say(t.timerData.channel, t.timerData.message)
	}

	close(t.timerCh)
}

func (t *timer) SetTimerEnabled(client *client.Clients, channel string) {
	if timerData, ok := manager.timers[channel]; ok {
		newTimer := &timer{
			timerData: TimerData{
				enabled:  true,
				channel:  timerData.channel,
				message:  timerData.message,
				interval: timerData.interval,
			},
			timerCh: make(chan struct{}),
		}
		manager.timers[channel] = &newTimer.timerData

		go newTimer.NewTimerMessage(client)
	}
}

func (t *timer) SetTimerDisabled(channel string) {
	if timerData, ok := manager.timers[channel]; ok {
		timerData.enabled = false
	}
}

func (t *timer) GetTimerStatus(channel string) bool {
	if timerData, ok := manager.timers[channel]; ok {
		return timerData.enabled
	}

	return false
}

func (t *timer) SetTimer(client *client.Clients, channel string, message string, interval int) {
	manager.mutex.Lock()
	defer manager.mutex.Unlock()

	if timerData, ok := manager.timers[channel]; ok {
		timerData.enabled = true
		timerData.message = message
		timerData.interval = interval
	} else {
		newTimer := &timer{
			timerData: TimerData{
				enabled:  true,
				channel:  channel,
				message:  message,
				interval: interval,
			},
			timerCh: make(chan struct{}),
		}
		manager.timers[channel] = &newTimer.timerData

		go newTimer.NewTimerMessage(client)
	}

	go func() {
		select {
		case <-t.timerCh:
			manager.mutex.Lock()
			defer manager.mutex.Unlock()

			delete(manager.timers, channel)
		}
	}()
}

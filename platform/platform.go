package platform

type Platform string

const (
	TWITCH  Platform = "twitch"
	DISCORD Platform = "discord"
)

func (p Platform) String() string {
	return string(p)
}

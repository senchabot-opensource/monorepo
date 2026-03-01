package helper

func IsValidTwitchUsername(username string) bool {
	// Twitch usernames can only contain alphanumeric characters and underscores, and must be between 4 and 25 characters long
	if len(username) < 4 || len(username) > 25 {
		return false
	}
	for _, ch := range username {
		if !(isLetter(ch) || isDigit(ch) || ch == '_') {
			return false
		}
	}
	return true
}

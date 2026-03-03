package helper

import "strings"

func AreCommandAndMentionIndicesInvalid(cmdIndex int, mentionIndex int) bool {
	return cmdIndex < 0 || cmdIndex > 1 || mentionIndex > 1
}

func AreCommandAndMentionIndicesMismatched(cmdIndex int, mentionIndex int) bool {
	return cmdIndex+1 != mentionIndex && mentionIndex+1 != cmdIndex
}

func ParseMessage(message string) (string, []string) {
	words := strings.Fields(message)
	cmdIndex, mentionIndex := FindCommandAndMentionIndices(words)

	if AreCommandAndMentionIndicesInvalid(cmdIndex, mentionIndex) {
		return "", nil
	}

	// 0 and 1 indexes, if there is no mention, the command cannot be placed in any index other than 0.
	if AreCommandAndMentionIndicesMismatched(cmdIndex, mentionIndex) {
		return "", nil
	}

	cmdName := words[cmdIndex]
	params := words[cmdIndex+1:]

	// wykonos
	cmdName = strings.TrimPrefix(cmdName, "!")

	if mentionIndex < 0 {
		return cmdName, params
	}

	mention := words[mentionIndex]

	return cmdName, []string{mention}
}

func FindCommandAndMentionIndices(words []string) (int, int) {
	cmdIndex := -1
	mentionIndex := -1
	for i, v := range words {
		if strings.HasPrefix(v, "!") && cmdIndex < 0 {
			cmdIndex = i
		}
		if strings.HasPrefix(v, "@") && mentionIndex < 0 {
			mentionIndex = i
		}
	}

	return cmdIndex, mentionIndex
}

func ParseSysCmdMessage(message string) (string, []string) {
	var cmdName string

	splitMsg := strings.Split(message, " ")
	if !strings.HasPrefix(splitMsg[0], "!") {
		return "", nil
	}

	cmdName = splitMsg[0]
	params := splitMsg[1:]

	// wykonos
	cmdName = strings.TrimPrefix(cmdName, "!")

	return cmdName, params
}

func FindCommandIndices(words []string) int {
	cmdIndex := -1
	for i, v := range words {
		if strings.HasPrefix(v, "!") && cmdIndex < 0 {
			cmdIndex = i
		}
	}

	return cmdIndex
}

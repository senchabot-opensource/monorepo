// https://www.youtube.com/watch?v=dQw4w9WgXcQ
package helpers

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestAreCommandAndMentionIndicesInvalid(t *testing.T) {
	t.Run("all indices are valid", func(t *testing.T) {
		assert.False(t, AreCommandAndMentionIndicesInvalid(1, 0), "@senchabot !command")
		assert.False(t, AreCommandAndMentionIndicesInvalid(0, 1), "!command @senchabot")
	})

	t.Run("cmd index is invalid (command not found)", func(t *testing.T) {
		assert.True(t, AreCommandAndMentionIndicesInvalid(-1, 0))
	})

	t.Run("command cannot be in the params", func(t *testing.T) {
		assert.True(t, AreCommandAndMentionIndicesInvalid(2, 0))
	})

	t.Run("mention cannot be in the second params", func(t *testing.T) {
		assert.True(t, AreCommandAndMentionIndicesInvalid(0, 2))
	})
}

func TestAreCommandAndMentionIndicesMismatched(t *testing.T) {
	t.Run("cmd index is one more than mention index", func(t *testing.T) {
		assert.False(t, AreCommandAndMentionIndicesMismatched(0, 1))
	})

	t.Run("mention index is one more than cmd index", func(t *testing.T) {
		assert.False(t, AreCommandAndMentionIndicesMismatched(1, 0))
	})
}

func TestParseMessage(t *testing.T) {
	t.Run("with just message", func(t *testing.T) {
		cmd, params := ParseMessage("abc")

		assert.Equal(t, "", cmd, "cmd should be equal")
		assert.Equal(t, []string(nil), params, "params should equal")
	})

	t.Run("with a command", func(t *testing.T) {
		cmd, params := ParseMessage("!kampus")

		assert.Equal(t, "kampus", cmd, "cmd should be equal")
		assert.Equal(t, []string{}, params, "params should equal")
	})

	t.Run("with just mention", func(t *testing.T) {
		cmd, params := ParseMessage("@senchabot")

		assert.Equal(t, "", cmd, "cmd should be equal")
		assert.Equal(t, []string(nil), params, "params should equal")
	})

	t.Run("if there is space in params, do not include the space in the params", func(t *testing.T) {
		cmd, params := ParseMessage("!acmd  commandname the command content")

		assert.Equal(t, "acmd", cmd, "cmd should be equal")
		assert.Equal(t, []string{"commandname", "the", "command", "content"}, params, "params should equal")
	})

	t.Run("if there is a command name with exclamation prefix in the params", func(t *testing.T) {
		cmd, params := ParseMessage("!acmda commandname !acommandalias")

		assert.Equal(t, "acmda", cmd, "cmd should be equal")
		assert.Equal(t, []string{"commandname", "!acommandalias"}, params, "params should equal")
	})

	t.Run("if there is a exclamation prefix in the command name of the command to be created", func(t *testing.T) {
		cmd, params := ParseMessage("!acmd !commandname this is the command content")

		assert.Equal(t, "acmd", cmd, "cmd should be equal")
		assert.Equal(t, []string{"!commandname", "this", "is", "the", "command", "content"}, params, "params should equal")
	})

	t.Run("if the command with its params are in the wrong position, return nothing", func(t *testing.T) {
		cmd, params := ParseMessage("blabla !acmd acommand a command content")

		assert.Equal(t, "", cmd, "cmd should be equal")
		assert.Equal(t, []string(nil), params, "params should equal")
	})

	t.Run("if there is more than one mention, only the first mention is used", func(t *testing.T) {
		cmd, params := ParseMessage("!lurk @senchabot and @whimsicallymade")

		assert.Equal(t, "lurk", cmd, "cmd should be equal")
		assert.Equal(t, []string{"@senchabot"}, params, "params should equal")
	})

	t.Run("if there is a mention after the command, the command name should be at index 0, and the remaning words should be treated as params", func(t *testing.T) {
		cmd, params := ParseMessage("!acmd @senchabot")

		assert.Equal(t, "acmd", cmd, "cmd should be equal")
		assert.Equal(t, []string{"@senchabot"}, params, "params should equal")
	})

	t.Run("with a mention and a command", func(t *testing.T) {
		cmd, params := ParseMessage("@senchabot !acmd")

		assert.Equal(t, "acmd", cmd, "cmd should be equal")
		assert.Equal(t, []string{"@senchabot"}, params, "params should equal")
	})
}

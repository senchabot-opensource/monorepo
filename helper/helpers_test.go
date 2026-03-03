package helper_test

import (
	"testing"

	"github.com/senchabot-opensource/monorepo/helper"
	"github.com/stretchr/testify/assert"
)

func TestMakeUniqueArray(t *testing.T) {
	type TestCase struct {
		description string
		input       []string
		expected    []string
	}

	testCases := []TestCase{
		{
			description: "with one element",
			input:       []string{"abc"},
			expected:    []string{"abc"},
		},
		{
			description: "with the same elements",
			input:       []string{"abc", "def", "abc"},
			expected:    []string{"abc", "def"},
		},
		{

			description: "with the unique elements",
			input:       []string{"abc", "def", "ghi"},
			expected:    []string{"abc", "def", "ghi"},
		},
	}

	for _, testCase := range testCases {
		t.Run(testCase.description, func(t *testing.T) {
			uniqueArr := helper.MakeUniqueArray(testCase.input)

			assert.Equal(t, testCase.expected, uniqueArr, "they should be equal")
		})
	}
}

func TestParseTwitchUsernameURLParam(t *testing.T) {
	tests := []struct {
		name string
		url  string
		want string
	}{
		{
			name: "Valid Twitch URL",
			url:  "https://www.twitch.tv/username",
			want: "username",
		},
		{
			name: "Invalid Twitch URL",
			url:  "https://example.com",
			want: "",
		},
		{
			name: "Mobile Twitch URL",
			url:  "https://m.twitch.tv/username",
			want: "username",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := helper.ParseTwitchUsernameURLParam(tt.url)
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestParseTwitchUsername(t *testing.T) {
	tests := []struct {
		name    string
		input   string
		want    string
		wantErr bool
		errMsg  string
	}{
		{
			name:    "Valid Twitch URL",
			input:   "https://www.twitch.tv/username",
			want:    "username",
			wantErr: false,
		},
		{
			name:    "Valid mobile Twitch URL",
			input:   "https://m.twitch.tv/username",
			want:    "username",
			wantErr: false,
		},
		{
			name:    "Valid username format",
			input:   "username123",
			want:    "username123",
			wantErr: false,
		},
		{
			name:    "Valid username with underscore",
			input:   "user_name_123",
			want:    "user_name_123",
			wantErr: false,
		},
		{
			name:    "Username too short",
			input:   "abc",
			want:    "",
			wantErr: true,
			errMsg:  "invalid Twitch username format: abc",
		},
		{
			name:    "Username too long",
			input:   "thisusernameiswaytoolongforTwitch",
			want:    "",
			wantErr: true,
			errMsg:  "invalid Twitch username format: thisusernameiswaytoolongforTwitch",
		},
		{
			name:    "Username with invalid characters",
			input:   "user@name",
			want:    "",
			wantErr: true,
			errMsg:  "invalid Twitch username format: user@name",
		},
		{
			name:    "Empty string",
			input:   "",
			want:    "",
			wantErr: true,
			errMsg:  "invalid Twitch username format: ",
		},
		{
			name:    "Invalid URL format",
			input:   "not-a-url",
			want:    "",
			wantErr: true,
			errMsg:  "invalid Twitch username format: not-a-url",
		},
		{
			name:    "Twitch URL with query parameters",
			input:   "https://www.twitch.tv/username?param=value",
			want:    "",
			wantErr: true,
			errMsg:  "invalid Twitch username format: https://www.twitch.tv/username?param=value",
		},
		{
			name:    "Twitch URL with trailing slash",
			input:   "https://www.twitch.tv/username/",
			want:    "username",
			wantErr: false,
		},
		{
			name:    "Twitch URL with uppercase username",
			input:   "https://www.twitch.tv/USERNAME",
			want:    "USERNAME",
			wantErr: false,
		},
		{
			name:    "Username with numbers only",
			input:   "123456789",
			want:    "123456789",
			wantErr: false,
		},
		{
			name:    "Username with minimum length (4 chars)",
			input:   "user",
			want:    "user",
			wantErr: false,
		},
		{
			name:    "Username with maximum length (25 chars)",
			input:   "thisisamaximumlengthuser",
			want:    "thisisamaximumlengthuser",
			wantErr: false,
		},
		{
			name:    "Username with multiple underscores",
			input:   "user_name_",
			want:    "user_name_",
			wantErr: false,
		},
		{
			name:    "Username with consecutive underscores",
			input:   "user__name",
			want:    "user__name",
			wantErr: false,
		},
		{
			name:    "Username starting with underscore",
			input:   "_username",
			want:    "_username",
			wantErr: false,
		},
		{
			name:    "Username ending with underscore",
			input:   "username_",
			want:    "username_",
			wantErr: false,
		},
		{
			name:    "Username with mixed case",
			input:   "User_Name_123",
			want:    "User_Name_123",
			wantErr: false,
		},
		{
			name:    "Invalid URL with Twitch domain but wrong format",
			input:   "https://twitch.tv/",
			want:    "",
			wantErr: true,
			errMsg:  "invalid Twitch username format: https://twitch.tv/",
		},
		{
			name:    "URL with invalid protocol",
			input:   "ftp://twitch.tv/username",
			want:    "",
			wantErr: true,
			errMsg:  "invalid Twitch username format: ftp://twitch.tv/username",
		},
		{
			name:    "Username with spaces",
			input:   "user name",
			want:    "",
			wantErr: true,
			errMsg:  "invalid Twitch username format: user name",
		},
		{
			name:    "Username with special characters",
			input:   "user-name",
			want:    "",
			wantErr: true,
			errMsg:  "invalid Twitch username format: user-name",
		},
		{
			name:    "Username with unicode characters",
			input:   "usernäme",
			want:    "",
			wantErr: true,
			errMsg:  "invalid Twitch username format: usernäme",
		},
		{
			name:    "Username with emoji",
			input:   "user😊name",
			want:    "",
			wantErr: true,
			errMsg:  "invalid Twitch username format: user😊name",
		},
		{
			name:    "Username with HTML entities",
			input:   "user&amp;name",
			want:    "",
			wantErr: true,
			errMsg:  "invalid Twitch username format: user&amp;name",
		},
		{
			name:    "Username with SQL injection attempt",
			input:   "user'; DROP TABLE users; --",
			want:    "",
			wantErr: true,
			errMsg:  "invalid Twitch username format: user'; DROP TABLE users; --",
		},
		{
			name:    "Username with XSS attempt",
			input:   "user<script>alert('xss')</script>name",
			want:    "",
			wantErr: true,
			errMsg:  "invalid Twitch username format: user<script>alert('xss')</script>name",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := helper.ParseTwitchUsername(tt.input)

			if tt.wantErr {
				assert.Error(t, err)
				assert.Equal(t, tt.errMsg, err.Error())
				assert.Empty(t, got)
				return
			}

			assert.NoError(t, err)
			assert.Equal(t, tt.want, got)
		})
	}
}

// COMMAND

func TestAreCommandAndMentionIndicesInvalid(t *testing.T) {
	t.Run("all indices are valid", func(t *testing.T) {
		assert.False(t, helper.AreCommandAndMentionIndicesInvalid(1, 0), "@senchabot !command")
		assert.False(t, helper.AreCommandAndMentionIndicesInvalid(0, 1), "!command @senchabot")
	})

	t.Run("cmd index is invalid (command not found)", func(t *testing.T) {
		assert.True(t, helper.AreCommandAndMentionIndicesInvalid(-1, 0))
	})

	t.Run("command cannot be in the params", func(t *testing.T) {
		assert.True(t, helper.AreCommandAndMentionIndicesInvalid(2, 0))
	})

	t.Run("mention cannot be in the second params", func(t *testing.T) {
		assert.True(t, helper.AreCommandAndMentionIndicesInvalid(0, 2))
	})
}

func TestAreCommandAndMentionIndicesMismatched(t *testing.T) {
	t.Run("cmd index is one more than mention index", func(t *testing.T) {
		assert.False(t, helper.AreCommandAndMentionIndicesMismatched(0, 1))
	})

	t.Run("mention index is one more than cmd index", func(t *testing.T) {
		assert.False(t, helper.AreCommandAndMentionIndicesMismatched(1, 0))
	})
}

func TestParseMessage(t *testing.T) {
	t.Run("with just message", func(t *testing.T) {
		cmd, params := helper.ParseMessage("abc")

		assert.Equal(t, "", cmd, "cmd should be equal")
		assert.Equal(t, []string(nil), params, "params should equal")
	})

	t.Run("with a command", func(t *testing.T) {
		cmd, params := helper.ParseMessage("!kampus")

		assert.Equal(t, "kampus", cmd, "cmd should be equal")
		assert.Equal(t, []string{}, params, "params should equal")
	})

	t.Run("with just mention", func(t *testing.T) {
		cmd, params := helper.ParseMessage("@senchabot")

		assert.Equal(t, "", cmd, "cmd should be equal")
		assert.Equal(t, []string(nil), params, "params should equal")
	})

	t.Run("if there is space in params, do not include the space in the params", func(t *testing.T) {
		cmd, params := helper.ParseMessage("!acmd  commandname the command content")

		assert.Equal(t, "acmd", cmd, "cmd should be equal")
		assert.Equal(t, []string{"commandname", "the", "command", "content"}, params, "params should equal")
	})

	t.Run("if there is a command name with exclamation prefix in the params", func(t *testing.T) {
		cmd, params := helper.ParseMessage("!acmda commandname !acommandalias")

		assert.Equal(t, "acmda", cmd, "cmd should be equal")
		assert.Equal(t, []string{"commandname", "!acommandalias"}, params, "params should equal")
	})

	t.Run("if there is a exclamation prefix in the command name of the command to be created", func(t *testing.T) {
		cmd, params := helper.ParseMessage("!acmd !commandname this is the command content")

		assert.Equal(t, "acmd", cmd, "cmd should be equal")
		assert.Equal(t, []string{"!commandname", "this", "is", "the", "command", "content"}, params, "params should equal")
	})

	t.Run("if the command with its params are in the wrong position, return nothing", func(t *testing.T) {
		cmd, params := helper.ParseMessage("blabla !acmd acommand a command content")

		assert.Equal(t, "", cmd, "cmd should be equal")
		assert.Equal(t, []string(nil), params, "params should equal")
	})

	t.Run("if there is more than one mention, only the first mention is used", func(t *testing.T) {
		cmd, params := helper.ParseMessage("!lurk @senchabot and @whimsicallymade")

		assert.Equal(t, "lurk", cmd, "cmd should be equal")
		assert.Equal(t, []string{"@senchabot"}, params, "params should equal")
	})

	t.Run("if there is a mention after the command, the command name should be at index 0, and the remaning words should be treated as params", func(t *testing.T) {
		cmd, params := helper.ParseMessage("!acmd @senchabot")

		assert.Equal(t, "acmd", cmd, "cmd should be equal")
		assert.Equal(t, []string{"@senchabot"}, params, "params should equal")
	})

	t.Run("with a mention and a command", func(t *testing.T) {
		cmd, params := helper.ParseMessage("@senchabot !acmd")

		assert.Equal(t, "acmd", cmd, "cmd should be equal")
		assert.Equal(t, []string{"@senchabot"}, params, "params should equal")
	})
}

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

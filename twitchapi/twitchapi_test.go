package twitchapi

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/senchabot-opensource/monorepo/model"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// newTestService creates a twitchService backed by a mock Helix server and a mock token server.
// The helixHandler handles all /helix/* requests. Auth is pre-seeded so tests don't need a token server
// unless testing token refresh.
func newTestService(t *testing.T, helixHandler http.Handler) (*twitchService, *httptest.Server) {
	t.Helper()

	helixServer := httptest.NewServer(helixHandler)

	// Minimal token server that always succeeds
	tokenServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"access_token": "test-token",
			"expires_in":   3600,
			"token_type":   "bearer",
		})
	}))
	t.Cleanup(func() {
		helixServer.Close()
		tokenServer.Close()
	})

	svc := &twitchService{
		clientID:     "test-client-id",
		clientSecret: "test-client-secret",
		botUserID:    "test-bot-user-id",
		httpClient:   &http.Client{},
		helixBaseURL: helixServer.URL,
		tokenURL:     tokenServer.URL,
		accessToken:  "test-token",
	}

	return svc, helixServer
}

// --- GetUserInfoByLoginName ---

func TestGetUserInfoByLoginName_Success(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		assert.Equal(t, "testuser", r.URL.Query().Get("login"))
		assert.Equal(t, "Bearer test-token", r.Header.Get("Authorization"))
		assert.Equal(t, "test-client-id", r.Header.Get("Client-Id"))

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"data": []model.TwitchUserInfo{
				{
					ID:              "12345",
					Login:           "testuser",
					DisplayName:     "TestUser",
					BroadcasterType: "partner",
					Description:     "A test user",
					ProfileImageURL: "https://example.com/pic.jpg",
				},
			},
		})
	})

	svc, _ := newTestService(t, handler)

	userInfo, err := svc.GetUserInfoByLoginName("testuser")
	require.NoError(t, err)
	assert.Equal(t, "12345", userInfo.ID)
	assert.Equal(t, "testuser", userInfo.Login)
	assert.Equal(t, "TestUser", userInfo.DisplayName)
	assert.Equal(t, "partner", userInfo.BroadcasterType)
	assert.Equal(t, "https://example.com/pic.jpg", userInfo.ProfileImageURL)
}

func TestGetUserInfoByLoginName_NotFound(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"data": []model.TwitchUserInfo{},
		})
	})

	svc, _ := newTestService(t, handler)

	userInfo, err := svc.GetUserInfoByLoginName("nonexistentuser")
	assert.Error(t, err)
	assert.Nil(t, userInfo)
	assert.Contains(t, err.Error(), "user not found")
}

// --- GetUserInfoById ---

func TestGetUserInfoById_Success(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		assert.Equal(t, "67890", r.URL.Query().Get("id"))

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"data": []model.TwitchUserInfo{
				{
					ID:          "67890",
					Login:       "anotheruser",
					DisplayName: "AnotherUser",
				},
			},
		})
	})

	svc, _ := newTestService(t, handler)

	userInfo, err := svc.GetUserInfoById("67890")
	require.NoError(t, err)
	assert.Equal(t, "67890", userInfo.ID)
	assert.Equal(t, "anotheruser", userInfo.Login)
}

func TestGetUserInfoById_NotFound(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"data": []model.TwitchUserInfo{},
		})
	})

	svc, _ := newTestService(t, handler)

	userInfo, err := svc.GetUserInfoById("99999")
	assert.Error(t, err)
	assert.Nil(t, userInfo)
	assert.Contains(t, err.Error(), "user not found for id")
}

// --- CheckStreamStatus ---

func TestCheckStreamStatus_Live(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		assert.Equal(t, "streameruser", r.URL.Query().Get("user_login"))

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"data": []model.TwitchStreamerData{
				{
					UserID:    "111",
					UserLogin: "streameruser",
					UserName:  "StreamerUser",
					GameName:  "Valorant",
					Type:      "live",
					Title:     "Ranked grind!",
				},
			},
		})
	})

	svc, _ := newTestService(t, handler)

	isLive, title, err := svc.CheckStreamStatus("streameruser")
	require.NoError(t, err)
	assert.True(t, isLive)
	assert.Equal(t, "Ranked grind!", title)
}

func TestCheckStreamStatus_Offline(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"data": []model.TwitchStreamerData{},
		})
	})

	svc, _ := newTestService(t, handler)

	isLive, title, err := svc.CheckStreamStatus("offlineuser")
	require.NoError(t, err)
	assert.False(t, isLive)
	assert.Empty(t, title)
}

// --- CheckMultipleStreamers ---

func TestCheckMultipleStreamers_Success(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userIds := r.URL.Query()["user_id"]
		assert.Equal(t, 3, len(userIds))
		assert.Contains(t, userIds, "100")
		assert.Contains(t, userIds, "200")
		assert.Contains(t, userIds, "300")

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"data": []model.TwitchStreamerData{
				{UserID: "100", UserLogin: "user100", Type: "live", Title: "Stream 1"},
				{UserID: "300", UserLogin: "user300", Type: "live", Title: "Stream 3"},
			},
		})
	})

	svc, _ := newTestService(t, handler)

	streams, err := svc.CheckMultipleStreamers([]string{"100", "200", "300"})
	require.NoError(t, err)
	assert.Len(t, streams, 2)
	assert.Equal(t, "100", streams[0].UserID)
	assert.Equal(t, "300", streams[1].UserID)
}

func TestCheckMultipleStreamers_EmptyInput(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		t.Fatal("should not make any HTTP request for empty input")
	})

	svc, _ := newTestService(t, handler)

	streams, err := svc.CheckMultipleStreamers([]string{})
	require.NoError(t, err)
	assert.Nil(t, streams)
}

func TestCheckMultipleStreamers_NoLiveStreamers(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"data": []model.TwitchStreamerData{},
		})
	})

	svc, _ := newTestService(t, handler)

	streams, err := svc.CheckMultipleStreamers([]string{"100", "200"})
	require.NoError(t, err)
	assert.Empty(t, streams)
}

// --- GiveShoutout ---

func TestGiveShoutout_DefaultMessage(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"data": []model.TwitchUserInfo{
				{
					ID:          "555",
					Login:       "coolstreamer",
					DisplayName: "CoolStreamer",
					Description: "I stream cool games",
				},
			},
		})
	})

	svc, _ := newTestService(t, handler)

	msg, err := svc.GiveShoutout("coolstreamer", "broadcaster123", "")
	require.NoError(t, err)
	require.NotNil(t, msg)
	assert.Equal(t, "Check out CoolStreamer at https://www.twitch.tv/coolstreamer!", *msg)
}

func TestGiveShoutout_CustomMessageFormat(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"data": []model.TwitchUserInfo{
				{
					ID:          "555",
					Login:       "coolstreamer",
					DisplayName: "CoolStreamer",
					Description: "Retro gaming",
				},
			},
		})
	})

	svc, _ := newTestService(t, handler)

	msg, err := svc.GiveShoutout("coolstreamer", "broadcaster123", "Go follow {username} at {url} - they play {game}!")
	require.NoError(t, err)
	require.NotNil(t, msg)
	assert.Equal(t, "Go follow CoolStreamer at https://www.twitch.tv/coolstreamer - they play Retro gaming!", *msg)
}

func TestGiveShoutout_UserNotFound(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"data": []model.TwitchUserInfo{},
		})
	})

	svc, _ := newTestService(t, handler)

	msg, err := svc.GiveShoutout("unknownuser", "broadcaster123", "")
	assert.Error(t, err)
	assert.Nil(t, msg)
	assert.Contains(t, err.Error(), "user not found")
}

// --- Token Refresh (401 handling) ---

func TestTokenRefreshOn401(t *testing.T) {
	callCount := 0
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		callCount++
		if callCount == 1 {
			// First call returns 401
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		// Second call (after token refresh) succeeds
		assert.True(t, strings.HasPrefix(r.Header.Get("Authorization"), "Bearer "))

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"data": []model.TwitchUserInfo{
				{ID: "1", Login: "refreshed", DisplayName: "Refreshed"},
			},
		})
	})

	svc, _ := newTestService(t, handler)

	userInfo, err := svc.GetUserInfoByLoginName("refreshed")
	require.NoError(t, err)
	assert.Equal(t, "Refreshed", userInfo.DisplayName)
	assert.Equal(t, 2, callCount, "should have made two requests (initial + retry after refresh)")
}

// --- API Error Handling ---

func TestHelixAPIError(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error":"Internal Server Error","status":500,"message":"something went wrong"}`))
	})

	svc, _ := newTestService(t, handler)

	_, err := svc.GetUserInfoByLoginName("someuser")
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "500")
}

func TestAuthenticate_Success(t *testing.T) {
	tokenServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		assert.Equal(t, "POST", r.Method)
		r.ParseForm()
		assert.Equal(t, "test-client-id", r.FormValue("client_id"))
		assert.Equal(t, "test-client-secret", r.FormValue("client_secret"))
		assert.Equal(t, "client_credentials", r.FormValue("grant_type"))

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"access_token": "fresh-token",
			"expires_in":   7200,
			"token_type":   "bearer",
		})
	}))
	defer tokenServer.Close()

	svc := &twitchService{
		clientID:     "test-client-id",
		clientSecret: "test-client-secret",
		httpClient:   &http.Client{},
		tokenURL:     tokenServer.URL,
	}

	err := svc.authenticate()
	require.NoError(t, err)
	assert.Equal(t, "fresh-token", svc.accessToken)
}

func TestAuthenticate_Failure(t *testing.T) {
	tokenServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusForbidden)
		w.Write([]byte(`{"error":"invalid client"}`))
	}))
	defer tokenServer.Close()

	svc := &twitchService{
		clientID:     "bad-id",
		clientSecret: "bad-secret",
		httpClient:   &http.Client{},
		tokenURL:     tokenServer.URL,
	}

	err := svc.authenticate()
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "403")
}

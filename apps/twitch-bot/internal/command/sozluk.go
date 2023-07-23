package command

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"

	"github.com/gempir/go-twitch-irc/v3"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/config"
	"github.com/senchabot-dev/monorepo/apps/twitch-bot/internal/command/helpers"
)

const (
	gqlUrl    = "https://gql.dev.kamp.us/graphql"
	sozlukUrl = "https://sozluk.dev.kamp.us"

	SOZLUK_COMMAND_INFO = "For example: !sozluk [term-name]"
)

type SozlukGraphQLResponse struct {
	Data struct {
		Sozluk struct {
			Term struct {
				Title string `json:"title"`
				Body  struct {
					Raw string `json:"raw"`
				} `json:"body"`
			} `json:"term"`
		} `json:"sozluk"`
	} `json:"data"`
}

func FetchGraphQL(apiUrl string, query string) ([]byte, error) {
	queryParams := url.QueryEscape(query)
	fullURL := fmt.Sprintf("%s?query=%s", apiUrl, queryParams)

	resp, err := http.Get(fullURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return body, nil
}

func (c *commands) SozlukCommand(context context.Context, message twitch.PrivateMessage, commandName string, params []string) {
	if check := helpers.IsCommandParamsLengthEqualToOne(params); !check {
		c.client.Twitch.Say(message.Channel, SOZLUK_COMMAND_INFO)
		return
	}

	var sozlukTerm = strings.ToLower(strings.TrimSpace(params[0]))

	query := fmt.Sprintf(`{
		sozluk {
			term(input: {id: "%s"}) {
				title,
				body {
					raw
				}
			}
		}
	}`, sozlukTerm)

	response, err := FetchGraphQL(gqlUrl, query)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	var gqlResponse SozlukGraphQLResponse
	err = json.Unmarshal(response, &gqlResponse)
	if err != nil {
		fmt.Println("json.Unmarshal error:", err)
		return
	}

	termTitle := strings.TrimSpace(gqlResponse.Data.Sozluk.Term.Title)
	termDesc := strings.TrimSpace(gqlResponse.Data.Sozluk.Term.Body.Raw)

	if termDesc == "" {
		c.client.Twitch.Say(message.Channel, fmt.Sprintf(`the term "%s" not found`, sozlukTerm))
		return
	}

	if len(termDesc) > config.TwitchCharacterLimit {
		termDesc = termDesc[:250]

		c.client.Twitch.Reply(message.Channel, message.ID, termTitle+": "+termDesc+"... "+sozlukUrl+"/"+sozlukTerm)
		return
	}

	c.client.Twitch.Reply(message.Channel, message.ID, termTitle+": "+termDesc)
}

import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Paper,
  Stack,
} from "@mui/material";
import LoadingBox from "../loading/LoadingBox";
import { trpc } from "../../utils/trpc";

const SystemMessage = () => {
  const discordServerCount = trpc.example.getDcServerCount.useQuery();
  const twitchChannelCount = trpc.example.getTwServercount.useQuery();

  const twitchChannels = trpc.bot.getUserTwitchChannels.useQuery();
  const discordServers = trpc.bot.getUserDiscordServers.useQuery();

  return (
    <Paper
      sx={{
        mt: "10px",
        backgroundColor: "appContainer.border",
        padding: "10px",
      }}
      elevation={1}>
      <Stack>
        <List
          dense={false}
          sx={{ width: "100%", backgroundColor: "appContainer.background" }}
          subheader={
            <ListSubheader
              sx={{ backgroundColor: "appContainer.background" }}
              disableSticky>
              System messages:
            </ListSubheader>
          }
          disablePadding>
          {!discordServerCount.isLoading && !twitchChannelCount.isLoading ? (
            <>
              <ListItem>
                <ListItemText>
                  Connected Discord servers:{" "}
                  {discordServerCount.data?.toString()}
                </ListItemText>
              </ListItem>
              {discordServers.data?.length ? (
                <ListItem>
                  <ListItemText>
                    Discord Servers:{" "}
                    {discordServers.data?.map(
                      (sv, index) =>
                        sv.serverName +
                        (index !==
                        (discordServers.data && discordServers.data?.length - 1)
                          ? ", "
                          : ""),
                    )}
                  </ListItemText>
                </ListItem>
              ) : null}
              <ListItem>
                <ListItemText>
                  Connected Twitch channels:{" "}
                  {twitchChannelCount.data?.toString()}
                </ListItemText>
              </ListItem>
              {twitchChannels.data && (
                <ListItem>
                  <ListItemText>
                    Twitch Channels:{" "}
                    {twitchChannels.data?.map(
                      (ch, index) =>
                        ch.channelName +
                        (index !==
                        (twitchChannels.data && twitchChannels.data.length - 1)
                          ? ", "
                          : ""),
                    )}
                  </ListItemText>
                </ListItem>
              )}
            </>
          ) : (
            <LoadingBox />
          )}
        </List>
      </Stack>
    </Paper>
  );
};

export default SystemMessage;

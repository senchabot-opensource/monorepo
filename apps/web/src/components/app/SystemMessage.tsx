import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Paper,
  Stack,
} from "@mui/material";
import LoadingBox from "../loading/LoadingBox";
import {
  getDiscordServerCount,
  getDiscordServers,
  getTwitchChannelCount,
  getTwitchChannels,
} from "src/api";
import { IDiscordServer, ITwitchChannel } from "src/types";
import { useQuery } from "@tanstack/react-query";

const SystemMessage = () => {
  const discordServerCount = useQuery({
    queryKey: ["discordServerCount"],
    queryFn: async () => {
      const { data } = await getDiscordServerCount();
      return data;
    },
  });

  const twitchChannelCount = useQuery({
    queryKey: ["twitchChannelCount"],
    queryFn: async () => {
      const { data } = await getTwitchChannelCount();
      return data;
    },
  });

  const discordServers = useQuery({
    queryKey: ["discordServers"],
    queryFn: async () => {
      const { data } = await getDiscordServers();
      return data;
    },
  });

  const twitchChannels = useQuery({
    queryKey: ["twitchChannels"],
    queryFn: async () => {
      const { data } = await getTwitchChannels();
      return data;
    },
  });

  return (
    <Paper
      sx={{
        mt: "10px",
        backgroundImage: "none",
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
          {!discordServerCount.isLoading ||
          !twitchChannelCount.isLoading ||
          !discordServers.isLoading ||
          !twitchChannels.isLoading ? (
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
                    {discordServers.data.map(
                      (sv: IDiscordServer, index: number) =>
                        sv.serverName +
                        (index !==
                        (discordServers.data && discordServers.data.length - 1)
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
              {twitchChannels.data?.length ? (
                <ListItem>
                  <ListItemText>
                    Twitch Channels:{" "}
                    {twitchChannels.data.map(
                      (ch: ITwitchChannel, index: number) =>
                        ch.channelName +
                        (index !==
                        (twitchChannels.data && twitchChannels.data.length - 1)
                          ? ", "
                          : ""),
                    )}
                  </ListItemText>
                </ListItem>
              ) : null}
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

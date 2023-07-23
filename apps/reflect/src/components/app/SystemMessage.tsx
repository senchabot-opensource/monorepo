import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Paper,
  Stack,
} from "@mui/material";
import LoadingBox from "../loading/LoadingBox";
import { useEffect, useState } from "react";
import {
  getDiscordServerCount,
  getDiscordServers,
  getTwitchChannelCount,
  getTwitchChannels,
} from "src/api";
import { IDiscordServer, ITwitchChannel } from "src/types";

const SystemMessage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [discordServerCount, setDiscordServerCount] = useState<number>(0);
  const [twitchChannelCount, setTwitchChannelCount] = useState<number>(0);
  const [discordServers, setDiscordServers] = useState<IDiscordServer[]>([]);
  const [twitchChannels, setTwitchChannels] = useState<ITwitchChannel[]>([]);

  useEffect(() => {
    getDiscordServerCount().then(res => {
      setDiscordServerCount(res.data);
    });
    getTwitchChannelCount().then(res => {
      setTwitchChannelCount(res.data);
    });
    getDiscordServers().then(res => {
      setDiscordServers(res.data);
    });
    getTwitchChannels().then(res => {
      setTwitchChannels(res.data);
    });

    setIsLoading(false);
  }, [isLoading]);

  return (
    <Paper
      sx={{ mt: "10px", backgroundColor: "#000", padding: "10px" }}
      elevation={1}>
      <Stack>
        <List
          dense={false}
          sx={{ width: "100%", backgroundColor: "#000" }}
          subheader={
            <ListSubheader sx={{ backgroundColor: "#000" }} disableSticky>
              System messages:
            </ListSubheader>
          }
          disablePadding>
          {!isLoading ? (
            <>
              <ListItem>
                <ListItemText>
                  Connected Discord servers: {discordServerCount?.toString()}
                </ListItemText>
              </ListItem>
              {discordServers?.length ? (
                <ListItem>
                  <ListItemText>
                    Discord Servers:{" "}
                    {discordServers?.map(
                      (sv: IDiscordServer, index: number) =>
                        sv.serverName +
                        (index !==
                        (discordServers && discordServers?.length - 1)
                          ? ", "
                          : ""),
                    )}
                  </ListItemText>
                </ListItem>
              ) : null}
              <ListItem>
                <ListItemText>
                  Connected Twitch channels: {twitchChannelCount?.toString()}
                </ListItemText>
              </ListItem>
              {twitchChannels.length ? (
                <ListItem>
                  <ListItemText>
                    Twitch Channels:{" "}
                    {twitchChannels?.map(
                      (ch: ITwitchChannel, index: number) =>
                        ch.channelName +
                        (index !== (twitchChannels && twitchChannels.length - 1)
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

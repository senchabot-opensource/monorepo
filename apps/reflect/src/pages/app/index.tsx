import React from "react";
import { NextPage } from "next";
import {
  Paper,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";

import { AppContainer, AppHeader, AppSnackbar } from "../../components/app";
import { Offset } from "../../components/Offset";
import LoadingBox from "../../components/loading/LoadingBox";

import { SiDiscord, SiTwitch } from "react-icons/si";

import { trpc } from "../../utils/trpc";

const Dashboard: NextPage = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const example = trpc.example.getDcServerCount.useQuery();
  const twitchChannelCount = trpc.example.getTwServercount.useQuery();
  const botActivities = trpc.bot.getActivities.useQuery();

  const twitchChannels = trpc.bot.getTwitchChannels.useQuery();
  const discordServers = trpc.bot.getDiscordServers.useQuery();

  React.useEffect(() => {
    const interval = setInterval(() => setIsLoading(false), 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <AppHeader title="App" index={true} />
      <AppContainer isLoading={isLoading}>
        <AppSnackbar
          isSnackbarOpen={snackbarOpen}
          snackbarMessage={snackbarMessage}
        />

        <Paper
          sx={{ mt: "10px", backgroundColor: "#000", padding: "10px" }}
          elevation={1}
        >
          <Stack>
            <List
              dense={false}
              sx={{ width: "100%", backgroundColor: "#000" }}
              subheader={
                <ListSubheader sx={{ backgroundColor: "#000" }} disableSticky>
                  System messages:
                </ListSubheader>
              }
              disablePadding
            >
              {!example.isLoading && !twitchChannelCount.isLoading ? (
                <>
                  <ListItem>
                    <ListItemText>
                      Connected Discord servers: {example.data?.toString()}
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
                            (discordServers.data &&
                              discordServers.data?.length - 1)
                              ? ", "
                              : "")
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
                            (twitchChannels.data &&
                              twitchChannels.data.length - 1)
                              ? ", "
                              : "")
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
        <Paper
          sx={{ mt: "10px", backgroundColor: "#000", padding: "10px" }}
          elevation={1}
        >
          <Stack>
            <List
              dense={false}
              sx={{ width: "100%", backgroundColor: "#000" }}
              subheader={
                <ListSubheader sx={{ backgroundColor: "#000" }} disableSticky>
                  Recent bot activities:
                </ListSubheader>
              }
              disablePadding
            >
              {!botActivities.isLoading ? (
                botActivities.data?.length ? (
                  botActivities.data?.map((activity, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {activity.botPlatformType === "twitch" ? (
                          <SiTwitch />
                        ) : (
                          <SiDiscord />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.botActivity}
                        secondary={activity.activityDate.toDateString()}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No data." />
                  </ListItem>
                )
              ) : (
                <LoadingBox />
              )}
            </List>
          </Stack>
        </Paper>
        <Offset />
      </AppContainer>
    </>
  );
};

export default Dashboard;

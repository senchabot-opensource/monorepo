import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  Stack,
} from "@mui/material";
import { SiDiscord, SiTwitch } from "react-icons/si";
import LoadingBox from "../loading/LoadingBox";
import { IBotActionActivity } from "../../types";
import { useEffect, useState } from "react";
import { getBotActivites } from "src/api";

const activityText = (activity: IBotActionActivity) =>
  activity.botActivity.startsWith("!") || activity.botActivity.startsWith("/")
    ? `Command executed: ${activity.botActivity}`
    : activity.botActivity;

const activityDate = (activity: IBotActionActivity) => {
  const date = new Date(activity.activityDate).toDateString();
  const time = new Date(activity.activityDate).toTimeString().slice(0, 8);

  return date + " " + time;
};

const platformLogo = (activity: IBotActionActivity) =>
  activity.botPlatformType === "twitch" ? <SiTwitch /> : <SiDiscord />;

const activityAuthor = (activity: IBotActionActivity) =>
  activity.activityAuthor ?? "Senchabot";

const activityDateAndAuthor = (activity: IBotActionActivity) =>
  activityDate(activity) + " / " + activityAuthor(activity);

const BotActivity = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [botActivities, setBotactivites] = useState<IBotActionActivity[]>([]);

  useEffect(() => {
    getBotActivites().then(res => {
      setBotactivites(res.data);
      setIsLoading(false);
    });
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
              Recent bot activities:
            </ListSubheader>
          }
          disablePadding>
          {!isLoading ? (
            botActivities?.length ? (
              botActivities.map(
                (activity: IBotActionActivity, index: number) => (
                  <ListItem key={index}>
                    <ListItemIcon>{platformLogo(activity)}</ListItemIcon>
                    <ListItemText
                      primary={activityText(activity)}
                      secondary={activityDateAndAuthor(activity)}
                    />
                  </ListItem>
                ),
              )
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
  );
};

export default BotActivity;

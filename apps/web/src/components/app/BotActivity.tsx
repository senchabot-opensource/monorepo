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
import { getBotActivites } from "src/api";
import { useQuery } from "@tanstack/react-query";

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
  const botActivities = useQuery({
    queryKey: ["botActivities"],
    queryFn: async () => {
      const { data } = await getBotActivites();
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
              Recent bot activities:
            </ListSubheader>
          }
          disablePadding>
          {!botActivities.isLoading ? (
            botActivities.data.length ? (
              botActivities.data.map(
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

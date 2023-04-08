import {
  ListItem,
  Avatar,
  ListItemAvatar,
  ListItemText,
  Stack,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { SiDiscord, SiTwitch } from "react-icons/si";
import { signIn } from "next-auth/react";

const LinkAccount = () => {
  return (
    <>
      {/*<_Button variant="contained" onClick={() => signIn("discord")}>
      Discord account
    </_Button>
    <_Button variant="contained" onClick={() => signIn("github")}>
      GitHub account
    </_Button>
    <_Button variant="contained" onClick={() => signIn("twitch")}>
      Twitch account
</_Button>*/}

      <ListItem
        button
        onClick={() => signIn("discord")}
        sx={{ "&:hover": { borderRadius: 1 } }}>
        <ListItemAvatar>
          <Avatar>
            <SiDiscord />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="with Discord Account" />
      </ListItem>
      <ListItem
        button
        onClick={() => signIn("github")}
        sx={{ "&:hover": { borderRadius: 1 } }}>
        <ListItemAvatar>
          <Avatar>
            <GitHubIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="with GitHub Account" />
      </ListItem>
      <ListItem
        button
        onClick={() => signIn("twitch")}
        sx={{ "&:hover": { borderRadius: 1 } }}>
        <ListItemAvatar>
          <Avatar>
            <SiTwitch />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="with Twitch Account" />
      </ListItem>
    </>
  );
};

const LinkAccountStack = () => {
  return (
    <>
      <Stack
        spacing={2}
        direction="row"
        sx={{ display: { xs: "none", md: "flex" } }}>
        <LinkAccount />
      </Stack>

      <Stack direction="column" sx={{ display: { xs: "flex", md: "none" } }}>
        <LinkAccount />
      </Stack>
    </>
  );
};

export default LinkAccountStack;

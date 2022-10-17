import {
  Avatar,
  Container,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";

//import KeyIcon from "@mui/icons-material/Key";
//import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import { SiDiscord, SiTwitch } from "react-icons/si";
import { signIn } from "next-auth/react";

export const AuthContainer = () => {
  return (
    <Container sx={{ p: 2, backgroundColor: "#000" }}>
      <DialogTitle>Sign in/up</DialogTitle>
      <List sx={{ pt: 0 }}>
        {/*<ListItem
          button
          onClick={() =>
            signIn("google", {
              callbackUrl: `${window.location.origin}/app`,
            })
          }
          sx={{ "&:hover": { borderRadius: 1 } }}
        >
          <ListItemAvatar>
            <Avatar>
              <GoogleIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="with Google Account" />
        </ListItem>*/}
        <ListItem
          button
          onClick={() =>
            signIn("discord", {
              callbackUrl: `${window.location.origin}/app`,
            })
          }
          sx={{ "&:hover": { borderRadius: 1 } }}
        >
          <ListItemAvatar>
            <Avatar>
              <SiDiscord />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="with Discord Account" />
        </ListItem>
        <ListItem
          button
          onClick={() =>
            signIn("github", {
              callbackUrl: `${window.location.origin}/app`,
            })
          }
          sx={{ "&:hover": { borderRadius: 1 } }}
        >
          <ListItemAvatar>
            <Avatar>
              <GitHubIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="with GitHub Account" />
        </ListItem>
        <ListItem
          button
          onClick={() =>
            signIn("twitch", {
              callbackUrl: `${window.location.origin}/app`,
            })
          }
          sx={{ "&:hover": { borderRadius: 1 } }}
        >
          <ListItemAvatar>
            <Avatar>
              <SiTwitch />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="with Twitch Account" />
        </ListItem>
      </List>
    </Container>
  );
};

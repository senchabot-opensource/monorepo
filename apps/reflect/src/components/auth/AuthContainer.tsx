import {
  Avatar,
  Container,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";

import GitHubIcon from "@mui/icons-material/GitHub";
import { SiDiscord, SiTwitch } from "react-icons/si";
import { signIn } from "next-auth/react";
import Link from "next/link";

export const AuthContainer = () => {
  return (
    <Container sx={{ p: 2, backgroundColor: "#000" }}>
      <DialogTitle>Sign in/up</DialogTitle>
      <List sx={{ pt: 0 }}>
        <ListItem
          button
          onClick={() =>
            signIn("discord", {
              callbackUrl: `${window.location.origin}/app`,
            })
          }
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
          onClick={() =>
            signIn("twitch", {
              callbackUrl: `${window.location.origin}/app`,
            })
          }
          sx={{ "&:hover": { borderRadius: 1 } }}>
          <ListItemAvatar>
            <Avatar>
              <SiTwitch />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="with Twitch Account" />
        </ListItem>
        <ListItem>
          <ListItemText sx={{ maxWidth: "200px", textAlign: "justify" }}>
            By continuing you agree to{" "}
            <Link href="/cookie-policy" style={{ color: "#ffff00" }}>
              Cookie Policy
            </Link>
            ,{" "}
            <Link href="/privacy-policy" style={{ color: "#ffff00" }}>
              Privacy Policy
            </Link>
            ,{" "}
            <Link href="/terms" style={{ color: "#ffff00" }}>
              Terms of Use
            </Link>
            , and{" "}
            <Link href="/eula" style={{ color: "#ffff00" }}>
              EULA
            </Link>
            .
          </ListItemText>
        </ListItem>
      </List>
    </Container>
  );
};

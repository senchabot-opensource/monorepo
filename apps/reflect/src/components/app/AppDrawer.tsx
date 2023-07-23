import { styled, useTheme } from "@mui/material/styles";
import {
  Drawer,
  IconButton,
  Divider,
  Typography,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { env } from "../../env/client.mjs";
import Link from "next/link";
import { SiDiscord, SiTwitch } from "react-icons/si";
import CustomAlert from "../CustomAlert";
import { useState, FC, useEffect, useCallback } from "react";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { addTwitchAccount, checkTwitchAccount } from "src/api";
import { useRouter } from "next/router";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

type IProps = {
  isDrawerOpen: boolean;
  drawerHandler: () => void;
};

const AppDrawer: FC<IProps> = ({ isDrawerOpen, drawerHandler }) => {
  const theme = useTheme();
  const [isOpenAlert, setIsAlertOpen] = useState<boolean>(false);
  const [twitchAccountAvailable, setTwitchAccountAvailable] =
    useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");

  useEffect(() => {
    checkTwitchAccount().then(res => {
      setTwitchAccountAvailable(res.data);
    });
  });

  const addTwitchBot = useCallback(() => {
    addTwitchAccount().then(res => {
      if (!res || !res.success) {
        setAlertBox("Something went wrong. Please try again later.");
      }

      if (res.success) {
        setAlertBox(res.message);
      }
    });
  }, []);

  const setAlertBox = (text: string) => {
    setAlertText(text);
    setIsAlertOpen(true);
  };

  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={isDrawerOpen}>
      <CustomAlert
        content={alertText}
        isOpen={isOpenAlert}
        closeHandler={() => setIsAlertOpen(!isOpenAlert)}
      />
      <DrawerHeader>
        <Typography
          variant="h5"
          sx={{
            flexGrow: 1,
            ml: 2,
            fontFamily: "Source Code Pro",
            fontStyle: "italic",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
          }}>
          {env.NEXT_PUBLIC_APP_NAME}
        </Typography>
        <IconButton onClick={drawerHandler}>
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Stack direction="column" padding="20px 20px 0px 20px">
        <Typography>Get Bots</Typography>
        <Divider />
        <MenuList>
          <MenuItem
            component={Link}
            href={`${env.NEXT_PUBLIC_APP_DISCORD_BOT_INVITE_URL}`}>
            <ListItemIcon>
              <SiDiscord />
            </ListItemIcon>
            <Typography>Get Discord Bot</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (!twitchAccountAvailable) {
                setAlertBox(
                  "Before you can add the Twitch bot, you need to link your Twitch account in Settings/Security section.",
                );
              } else {
                addTwitchBot();
              }
            }}>
            <ListItemIcon>
              <SiTwitch />
            </ListItemIcon>
            <Typography>Get Twitch Bot</Typography>
          </MenuItem>
        </MenuList>
        <Typography fontSize="large">Common</Typography>
        <MenuList>
          <MenuItem href="/app/command-list" component={Link}>
            <ListItemIcon>
              <FormatListBulletedIcon />
            </ListItemIcon>
            <ListItemText>All Command List</ListItemText>
          </MenuItem>
        </MenuList>
      </Stack>
    </Drawer>
  );
};

export default AppDrawer;

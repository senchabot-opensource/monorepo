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
import { trpc } from "../../utils/trpc";
import CustomAlert from "../CustomAlert";
import { useState, FC } from "react";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

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
  const { data: twitchAcc } = trpc.check.checkTwitchAcc.useQuery();

  const [isOpenAlert, setIsOpenAlert] = useState<boolean>(false);

  const twitchBotMutate = trpc.twitchBot.add.useMutation({
    onSuccess() {
      alert("Twitch bot added");
    },

    onError(error) {
      if (!error.shape) return;
      alert(error.shape.message);
    },
  });

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
        content="Before you can add the Twitch bot, you need to link your Twitch account in Settings/Security section."
        isOpen={isOpenAlert}
        closeHandler={() => setIsOpenAlert(!isOpenAlert)}
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
            onClick={() =>
              !twitchAcc ? setIsOpenAlert(true) : twitchBotMutate.mutate()
            }>
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

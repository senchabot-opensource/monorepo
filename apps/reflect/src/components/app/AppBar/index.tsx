import * as React from "react";
import { styled, alpha, useTheme } from "@mui/material/styles";
import { Container, Toolbar, Typography, Box, IconButton } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { SiDiscord, SiTwitch } from "react-icons/si";
import { AccountMenu } from "./AccountMenu";
import { BootstrapTooltip } from "../Tooltip";
import { trpc } from "../../utils/trpc";
import AppSnackbar from "./AppSnackbar";
import { env } from "../../env/client.mjs";
import AppBarTitle from "../common/AppBarTitle";
import AppBarButton from "./AppBarButton";

import MinimizeIcon from "@mui/icons-material/Minimize";
import AppSearch from "./AppSearch";

interface IResponsiveAppBar {
  isDrawerOpen: boolean;
  drawerHandler: () => void;
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const ResponsiveAppBar = ({
  isDrawerOpen,
  drawerHandler,
}: IResponsiveAppBar) => {
  useSession({ required: true });
  const theme = useTheme();

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const { data: twitchAcc } = trpc.check.checkTwitchAcc.useQuery();

  const snackbarMsg = (message: string) => {
    setSnackbarOpen(!snackbarOpen);
    setSnackbarMessage(message);
  };

  const twitchBotMutate = trpc.twitchBot.add.useMutation({
    onSuccess() {
      snackbarMsg("Twitch bot added");
    },

    onError(error) {
      if (!error.shape) return;
      snackbarMsg(error.shape.message);
    },
  });

  return (
    <>
      <AppSnackbar
        isSnackbarOpen={snackbarOpen}
        snackbarMessage={snackbarMessage}
      />
      <AppBar
        position="fixed"
        color="transparent"
        sx={{
          backdropFilter: "blur(1px)",
          backgroundColor: alpha(theme.palette.background.paper, 0.85),
        }}
        elevation={2}
      >
        {/*open={isDrawerOpen} */}
        <Container>
          {/* <Container maxWidth="xl">*/}
          <Toolbar disableGutters>
            <AppBarTitle />

            <AppBarButton
              title="Open Sencha UI"
              pathHref="/sencha"
              ariaLabel="open sencha ui"
              drawerHandler={drawerHandler}
            >
              <MinimizeIcon />
            </AppBarButton>

            <BootstrapTooltip title="Get Twitch Bot">
              <Typography
                onClick={() =>
                  !twitchAcc
                    ? snackbarMsg(
                        "Before you can add the Twitch bot, you need to link your Twitch account in Settings/Security section."
                      )
                    : twitchBotMutate.mutate()
                }
              >
                <IconButton
                  aria-label="open drawer"
                  onClick={drawerHandler}
                  sx={{
                    display: "flex",
                    //mr: 1,
                    //...(isDrawerOpen && { display: "none" }),
                  }}
                >
                  <SiTwitch />
                </IconButton>
              </Typography>
            </BootstrapTooltip>
            <BootstrapTooltip title="Get Discord bot">
              <Typography>
                <Link
                  href={`${env.NEXT_PUBLIC_APP_DISCORD_BOT_INVITE_URL}`}
                  passHref
                >
                  <IconButton
                    aria-label="open drawer"
                    onClick={drawerHandler}
                    sx={{
                      display: "flex",
                      //mr: 1,
                      //...(isDrawerOpen && { display: "none" }),
                    }}
                  >
                    <SiDiscord />
                  </IconButton>
                </Link>
              </Typography>
            </BootstrapTooltip>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }} />

            <Link href="/sencha">
              <IconButton
                aria-label="open drawer"
                sx={{
                  display: { xs: "flex", md: "none" },
                  mr: 1,
                  ...(isDrawerOpen && { display: "none" }),
                }}
              >
                <MinimizeIcon />
              </IconButton>
            </Link>

            <AppSearch />

            <AccountMenu />
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

const commands = [{ name: "/", func: 0 }];

export default ResponsiveAppBar;

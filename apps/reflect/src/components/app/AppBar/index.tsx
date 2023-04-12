import * as React from "react";
import { styled, alpha, useTheme } from "@mui/material/styles";
import { Container, Toolbar, Box, IconButton } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { AccountMenu } from "../AccountMenu";
import AppSnackbar from "../AppSnackbar";

import AppBarTitle from "../../common/AppBarTitle";
import AppBarButton from "./AppBarButton";

import MinimizeIcon from "@mui/icons-material/Minimize";
import GetDiscordBotButton from "./buttons/GetDiscordBotButton";
import GetTwitchBotButton from "./buttons/GetTwitchBotButton";

interface IResponsiveAppBar {
  isDrawerOpen: boolean;
  drawerHandler: () => void;
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== "open",
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

  const snackbarMsg = (message: string) => {
    setSnackbarOpen(!snackbarOpen);
    setSnackbarMessage(message);
  };

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
        elevation={2}>
        {/*open={isDrawerOpen} */}
        <Container>
          {/* <Container maxWidth="xl">*/}
          <Toolbar disableGutters>
            <AppBarTitle />

            <AppBarButton
              title="Go to Sencha Web App"
              pathHref="https://sencha.senchabot.dev"
              ariaLabel="go to sencha web app"
              drawerHandler={drawerHandler}>
              <MinimizeIcon />
            </AppBarButton>

            <GetTwitchBotButton />
            <GetDiscordBotButton />

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }} />

            <Link href="https://sencha.senchabot.dev">
              <IconButton
                aria-label="go to sencha web app"
                sx={{
                  display: { xs: "flex", md: "none" },
                  mr: 1,
                  ...(isDrawerOpen && { display: "none" }),
                }}>
                <MinimizeIcon />
              </IconButton>
            </Link>

            <AccountMenu />
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default ResponsiveAppBar;

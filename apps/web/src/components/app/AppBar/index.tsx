import { styled } from "@mui/material/styles";
import { Container, Toolbar, Box, IconButton } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { useSession } from "next-auth/react";
import AccountMenu from "../AccountMenu";
import Logo from "../../common/Logo";
import { DarkMode, LightMode } from "@mui/icons-material";
import { ColorModeContext } from "src/Context/ColorModeContext";

import { FC, useContext } from "react";
import GetTwitchBotButton from "./buttons/GetTwitchBotButton";
import GetDiscordBotButton from "./buttons/GetDiscordBotButton";
import CommandListButton from "./buttons/CommandListButton";

type IResponsiveAppBarProps = {
  isDrawerOpen: boolean;
  drawerHandler: () => void;
};

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const ResponsiveAppBar: FC<IResponsiveAppBarProps> = ({
  isDrawerOpen,
  drawerHandler,
}) => {
  useSession({ required: true });
  const { colorMode, toggleColorMode } = useContext(ColorModeContext);

  return (
    <>
      <AppBar
        position="fixed"
        color="transparent"
        sx={{
          backdropFilter: "blur(4px)",
          backgroundColor: "appBar.background",
        }}
        elevation={2}>
        <Container>
          {/* <Container maxWidth="xl">*/}
          <Toolbar disableGutters>
            <Logo />

            <GetTwitchBotButton />
            <GetDiscordBotButton />
            <CommandListButton />
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }} />

            <Box>
              <IconButton
                onClick={toggleColorMode}
                sx={{
                  color: "landingButton.default",
                }}>
                {colorMode === "dark" ? (
                  <LightMode
                    sx={{
                      backgroundColor: "transparent",
                      color: "landingDashboardIcon.default",
                    }}
                  />
                ) : (
                  <DarkMode
                    sx={{
                      backgroundColor: "transparent",
                      color: "landingDashboardIcon.default",
                    }}
                  />
                )}
              </IconButton>
            </Box>
            <AccountMenu />
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default ResponsiveAppBar;

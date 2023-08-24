import { styled } from "@mui/material/styles";
import { Container, Toolbar, Box, IconButton } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AccountMenu from "../AccountMenu";
import Logo from "../../common/Logo";
import AppBarButton from "./AppBarButton";
import MinimizeIcon from "@mui/icons-material/Minimize";

import { useState } from "react";

import { FC } from "react";
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

const interfaceURL = "https://interface.senchabot.app";

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
  const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(false);

  return (
    <>
      <AppBar
        position="fixed"
        color="transparent"
        sx={{
          backdropFilter: "blur(4px)",
          backgroundColor: "background.default",
        }}
        elevation={2}>
        <Container>
          {/* <Container maxWidth="xl">*/}
          <Toolbar disableGutters>
            <Logo />
            <AppBarButton
              title="Go to Interface"
              pathHref={interfaceURL}
              ariaLabel="go to interface"
              drawerHandler={drawerHandler}>
              <MinimizeIcon />
            </AppBarButton>

            <GetTwitchBotButton />
            <GetDiscordBotButton />
            <CommandListButton />
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }} />
            <Link href={interfaceURL}>
              <IconButton
                aria-label="go to interface"
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

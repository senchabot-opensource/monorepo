import { styled, alpha, useTheme } from "@mui/material/styles";
import { Container, Toolbar, Box, IconButton } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AccountMenu from "../AccountMenu";
import AppBarTitle from "../../common/AppBarTitle";
import AppBarButton from "./AppBarButton";
import MinimizeIcon from "@mui/icons-material/Minimize";
import DrawerButton from "./buttons/DrawerButton";
import { useState } from "react";
import AppDrawer from "../AppDrawer";
import { FC } from "react";

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
  const theme = useTheme();
  const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(false);

  return (
    <>
      <AppDrawer
        isDrawerOpen={drawerIsOpen}
        drawerHandler={() => setDrawerIsOpen(!drawerIsOpen)}
      />
      <AppBar
        position="fixed"
        color="transparent"
        sx={{
          backdropFilter: "blur(4px)",
          backgroundColor: alpha(theme.palette.background.paper, 0.85),
        }}
        elevation={2}>
        <Container>
          {/* <Container maxWidth="xl">*/}
          <Toolbar disableGutters>
            <AppBarTitle />
            <AppBarButton
              title="Go to Interface"
              pathHref={interfaceURL}
              ariaLabel="go to interface"
              drawerHandler={drawerHandler}>
              <MinimizeIcon />
            </AppBarButton>
            <DrawerButton onClick={() => setDrawerIsOpen(!drawerIsOpen)} />
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

import * as React from "react";
import { styled, alpha, useTheme } from "@mui/material/styles";
import { Container, Toolbar, Typography, Box, IconButton } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
//import AdbIcon from "@mui/icons-material/Adb";
//import MenuIcon from "@mui/icons-material/Menu";
//import SearchIcon from "@mui/icons-material/Search";
import WidgetsIcon from "@mui/icons-material/Widgets";
import MinimizeIcon from "@mui/icons-material/Minimize";
/*import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";*/
import InputBase from "@mui/material/InputBase";
/*import Fade from "@mui/material/Fade";
import AuthDialog from "../auth/AuthDialog";*/
import { useSession } from "next-auth/react";
//import { signOut } from "next-auth/react";
import Link from "next/link";

import { SiDiscord, SiTwitch } from "react-icons/si";
//import { BsDiscord, BsTwitch } from "react-icons/bs";
import { AccountMenu } from "./AccountMenu";
import { BootstrapTooltip } from "../Tooltip";
import { trpc } from "../../utils/trpc";
import AppSnackbar from "./AppSnackbar";
import { env } from "../../env/client.mjs";
import AppBarTitle from "../common/AppBarTitle";
import AppBarButton from "./AppBarButton";

/*const pages = ["Get Discord bot", "Get Twitch bot"];
const settings = ["Settings"];*/

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.25),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.5),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "55%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
  /*'& .Mui-focused' : {
        marginRight: '120px',
    },*/
  transition: theme.transitions.create("margin-right"),
}));

/*const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));*/

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(1)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

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
            {/*<IconButton
      aria-label="open drawer"
      onClick={drawerHandler}
      sx={{
        display: { xs: "flex", md: "flex" },
        mr: 1,
        ...(isDrawerOpen && { display: "none" }),
      }}
    >
      <MenuIcon />
    </IconButton>*/}

            <AppBarButton
              title="Open Sencha UI"
              pathHref="/sencha"
              ariaLabel="open sencha ui"
              drawerHandler={drawerHandler}
            >
              <MinimizeIcon />
            </AppBarButton>

            {/*<AppBarButton
              title="Twitch Widgets"
              pathHref="/twitchchatrtl"
              ariaLabel="twitch overlay widgets"
              drawerHandler={drawerHandler}
            >
              <WidgetsIcon />
            </AppBarButton>*/}
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
              {/*<Typography>
      <Link href="/twitchbot" passHref>
        <a target="_blank">
          
        </a>
      </Link>
    </Typography>*/}
            </BootstrapTooltip>
            <BootstrapTooltip title="Get Discord bot">
              <Typography>
                <Link
                  href="https://discord.com/oauth2/authorize?client_id=985666091411984416&permissions=0&scope=bot%20applications.commands"
                  passHref
                >
                  <a target="_blank">
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
                  </a>
                </Link>
              </Typography>
            </BootstrapTooltip>

            {/*<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                      <IconButton
                          size="large"
                          aria-label="nav menu"
                          aria-controls="menu-appbar"
                          aria-haspopup="true"
                          onClick={handleOpenNavMenu}
                          color="inherit"
                      >
                          <MenuIcon />
                      </IconButton>
                      <Menu
                          id="menu-appbar"
                          anchorEl={anchorElNav}
                          anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'left',
                          }}
                          keepMounted
                          transformOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                          }}
                          open={Boolean(anchorElNav)}
                          onClose={handleCloseNavMenu}
                          sx={{
                              display: { xs: 'block', md: 'none' },
                          }}
                      >
                          {pages.map((page) => (
                              <MenuItem key={page} onClick={handleCloseNavMenu}>
                                  <Typography textAlign="center">{page}</Typography>
                              </MenuItem>
                          ))}
                      </Menu>
                          </Box>*/}
            {/*<AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />*/}

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {/*pages.map((page, index) => (
      <Link key={index} href="/_">
        <Button
          key={page}
          //onClick={handleCloseNavMenu}
          sx={{
            backgroundColor: alpha("#000", 0.25),
            "&:hover": {
              backgroundColor: alpha("#000", 0.75),
            },
            mx: 1,
            color: "white",
            display: "block",
          }}
        >
          {page}
        </Button>
      </Link>
        ))*/}
            </Box>
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

            <Search sx={{ display: { xs: "none", md: "flex" } }}>
              <StyledInputBase
                placeholder="/"
                inputProps={{
                  "aria-label": "search",
                }}
              />
            </Search>

            <AccountMenu />
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

const commands = [{ name: "/", func: 0 }];

export default ResponsiveAppBar;

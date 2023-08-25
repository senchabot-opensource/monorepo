import { alpha, createTheme } from "@mui/material";

export const landingTheme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: 10,
            backgroundColor: "#0c0c0c",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            backgroundColor: "#0c0c0c",
            minHeight: 24,
          },
          "&::-webkit-scrollbar-focus, & *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "#ff0000",
          },
          "&::-webkit-scrollbar-active, & *::-webkit-scrollbar-thumb:active": {
            backgroundColor: "#ff0000",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#2b2b2b",
          },
        },
      },
    },
  },
  palette: {
    mode: "dark",
    background: {
      //paper: "#FFF",
      default: "#000",
    },
    primary: {
      main: "#1976d2",
    },
    landingAppBar: {
      background: alpha("#000", 0.75),
    },
    landingButton: {
      default: "#646464",
      hover: "#FFF",
    },
    landingIcon: {
      background: "#000000",
      backgroundHover: "#0c0c0c",
    },
    landingDashboardIcon: {
      background: "#000",
      default: "#fff",
    },
    landingCmd: {
      primary: "#6034b2",
      secondary: "#7289da",
    },
    landingTitle: {
      primary: "#6034b2",
      secondary: "#7289da",
    },
    landingDiscordBtn: {
      background: "#7289da",
      backgroundHover: "rgba(114,137,218,0.74)",
    },
    landingTwitchBtn: {
      background: "#6034b2",
      backgroundHover: "rgba(96,52,178,0.74)",
    },
    landingTextBackground: "rgba(50,50,50,0.3)",

    appBreadcrumb: {
      background: "#0c0c0c",
    },
    appContainer: {
      background: "#000",
      border: "#0c0c0c",
    },
    appLoginForm: {
      background: "#060606",
      border: "#060606",
      policyText: "#ffff00",
      buttonBackground: "#202020",
    },
    libraryText: "#ffff00",
    deleteAccountBtn: {
      default: alpha("#ff0000", 0.4),
      hover: "#b71c1c",
    },
  },
});

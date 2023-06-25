import { PaletteMode } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { alpha } from "@mui/material";

const palette = {
  dark: {
    background: {
      default: "#000",
    },
    landingButton: {
      default: "#fff",
      hover: "#646464",
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
    primary: {
      main: "#1976d2",
    },
  },
  light: {
    background: {
      default: "#fff",
    },
    landingButton: {
      default: "#000",
      hover: "#fff",
    },
    landingIcon: {
      background: "#fff",
      backgroundHover: "#efefef",
    },
    landingDashboardIcon: {
      background: "#fff",
      default: "#000",
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
    primary: {
      main: "#1976d2",
    },
  },
};

export const getThemedComponents = (mode: PaletteMode) => ({
  components: {
    ...(mode === "dark"
      ? {
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
                "&::-webkit-scrollbar-focus, & *::-webkit-scrollbar-thumb:focus":
                  {
                    backgroundColor: "#ff0000",
                  },
                "&::-webkit-scrollbar-active, & *::-webkit-scrollbar-thumb:active":
                  {
                    backgroundColor: "#ff0000",
                  },
                "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb:hover":
                  {
                    backgroundColor: "#959595",
                  },
                "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
                  backgroundColor: "#2b2b2b",
                },
              },
            },
          },
        }
      : {
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
                "&::-webkit-scrollbar-focus, & *::-webkit-scrollbar-thumb:focus":
                  {
                    backgroundColor: "#ff0000",
                  },
                "&::-webkit-scrollbar-active, & *::-webkit-scrollbar-thumb:active":
                  {
                    backgroundColor: "#ff0000",
                  },
                "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb:hover":
                  {
                    backgroundColor: "#959595",
                  },
                "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
                  backgroundColor: "#2b2b2b",
                },
              },
            },
          },
        }),
  },
});

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "dark"
      ? {
          background: {
            default: palette.dark.background.default,
          },
          landingButton: {
            default: palette.dark.landingButton.default,
            hover: palette.dark.landingButton.hover,
          },
          landingIcon: {
            background: palette.dark.landingIcon.background,
            backgroundHover: palette.dark.landingIcon.backgroundHover,
          },
          landingDashboardIcon: {
            background: palette.dark.landingDashboardIcon.background,
            default: palette.dark.landingDashboardIcon.default,
          },
          landingCmd: {
            primary: palette.dark.landingCmd.primary,
            secondary: palette.dark.landingCmd.secondary,
          },
          landingTitle: {
            primary: palette.dark.landingTitle.primary,
            secondary: palette.dark.landingTitle.secondary,
          },
          landingDiscordBtn: {
            background: palette.dark.landingDiscordBtn.background,
            backgroundHover: palette.dark.landingDiscordBtn.backgroundHover,
          },
          landingTwitchBtn: {
            background: palette.dark.landingTwitchBtn.background,
            backgroundHover: palette.dark.landingTwitchBtn.backgroundHover,
          },
          landingTextBackground: palette.dark.landingTextBackground,
          primary: {
            main: palette.dark.primary.main,
          },
        }
      : {
          background: {
            default: palette.light.background.default,
          },
          landingButton: {
            default: palette.light.landingButton.default,
            hover: palette.light.landingButton.hover,
          },
          landingIcon: {
            background: palette.light.landingIcon.background,
            backgroundHover: palette.light.landingIcon.backgroundHover,
          },
          landingDashboardIcon: {
            background: palette.light.landingDashboardIcon.background,
            default: palette.light.landingDashboardIcon.default,
          },
          landingCmd: {
            primary: palette.light.landingCmd.primary,
            secondary: palette.light.landingCmd.secondary,
          },
          landingTitle: {
            primary: palette.light.landingTitle.primary,
            secondary: palette.light.landingTitle.secondary,
          },
          landingDiscordBtn: {
            background: palette.light.landingDiscordBtn.background,
            backgroundHover: palette.light.landingDiscordBtn.backgroundHover,
          },
          landingTwitchBtn: {
            background: palette.light.landingTwitchBtn.background,
            backgroundHover: palette.light.landingTwitchBtn.backgroundHover,
          },
          landingTextBackground: palette.light.landingTextBackground,
          primary: {
            main: palette.light.primary.main,
          },
        }),
  },
});

declare module "@mui/material/styles" {
  interface Palette {
    landingButton: {
      default: string;
      hover: string;
    };
    landingDashboardIcon: {
      background: string;
      default: string;
    };
    landingIcon: {
      background: string;
      backgroundHover: string;
    };
    landingCmd: {
      primary: string;
      secondary: string;
    };
    landingTitle: {
      primary: string;
      secondary: string;
    };
    landingDiscordBtn: {
      background: string;
      backgroundHover: string;
    };
    landingTwitchBtn: {
      background: string;
      backgroundHover: string;
    };
    landingTextBackground: string;
  }
  interface PaletteOptions {
    landingButton: {
      default: string;
      hover: string;
    };
    landingDashboardIcon: {
      background: string;
      default: string;
    };
    landingIcon: {
      background: string;
      backgroundHover: string;
    };
    landingCmd: {
      primary: string;
      secondary: string;
    };
    landingTitle: {
      primary: string;
      secondary: string;
    };
    landingDiscordBtn: {
      background: string;
      backgroundHover: string;
    };
    landingTwitchBtn: {
      background: string;
      backgroundHover: string;
    };
    landingTextBackground: string;
  }
}

export const darkTheme = createTheme({
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
    primary: {
      main: "#1976d2",
    },
  },
  // components: {
  //     MuiCssBaseline: {
  //         styleOverrides: {
  //             root: {
  //                 backgroundColor: '#000'
  //             },
  //         },
  //     },
  // },
});

export const landingDarkTheme = createTheme({
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
  },
});

// console.log(landingDarkTheme.palette.background.default);

// landingDarkTheme.palette.background.default = "#ffff00";

// console.log(landingDarkTheme.palette.background.default);

// setTimeout(() => {
//   landingDarkTheme.palette.background.default = "#ff0000";
// }, 500);

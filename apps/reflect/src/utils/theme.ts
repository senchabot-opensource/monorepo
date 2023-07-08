import { PaletteMode } from "@mui/material";
import { alpha } from "@mui/material";

const palette = {
  dark: {
    background: {
      default: "#000",
    },
    landingAppBar: {
      background: alpha("#000", 0.75),
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
    appBreadcrumb: {
      background: "#0c0c0c",
    },
    appContainer: {
      background: "#060606",
      border: "#060606",
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
  light: {
    background: {
      default: "#ffffff",
    },
    landingAppBar: {
      background: alpha("#fff", 0.75),
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
    landingTextBackground: "rgba(50,50,50,0.05)",
    primary: {
      main: "#1976d2",
    },
    appBreadcrumb: {
      background: "#e9e9e9",
    },
    appContainer: {
      background: "#fff",
      border: "#fff",
    },
    appLoginForm: {
      background: "#fff",
      border: "#fff",
      policyText: "#1976d2",
      buttonBackground: "#cfcfcf",
    },
    libraryText: "#ff8400",
    deleteAccountBtn: {
      default: alpha("#ff0000", 0.8),
      hover: "#D91F1F",
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
                  backgroundColor: "#959595",
                },
                "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                  backgroundColor: "#959595",
                  minHeight: 24,
                },
                "&::-webkit-scrollbar-focus, & *::-webkit-scrollbar-thumb:focus":
                  {
                    backgroundColor: "#2b2b2b",
                  },
                "&::-webkit-scrollbar-active, & *::-webkit-scrollbar-thumb:active":
                  {
                    backgroundColor: "#2b2b2b",
                  },
                "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb:hover":
                  {
                    backgroundColor: "#0c0c0c",
                  },
                "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
                  backgroundColor: "#ff0000",
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
          landingAppBar: {
            background: palette.dark.landingAppBar.background,
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
          appBreadcrumb: {
            background: palette.dark.appBreadcrumb.background,
          },
          appContainer: {
            background: palette.dark.appContainer.background,
            border: palette.dark.appContainer.border,
          },
          appLoginForm: {
            background: palette.dark.appLoginForm.background,
            border: palette.dark.appLoginForm.border,
            policyText: palette.dark.appLoginForm.policyText,
            buttonBackground: palette.dark.appLoginForm.buttonBackground,
          },
          libraryText: palette.dark.libraryText,
          deleteAccountBtn: {
            default: palette.dark.deleteAccountBtn.default,
            hover: palette.dark.deleteAccountBtn.hover,
          },
        }
      : {
          background: {
            default: palette.light.background.default,
          },
          landingAppBar: {
            background: palette.light.landingAppBar.background,
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
          appBreadcrumb: {
            background: palette.light.appBreadcrumb.background,
          },
          appContainer: {
            background: palette.light.appContainer.background,
            border: palette.light.appContainer.border,
          },
          appLoginForm: {
            background: palette.light.appLoginForm.background,
            border: palette.light.appLoginForm.border,
            policyText: palette.light.appLoginForm.policyText,
            buttonBackground: palette.light.appLoginForm.buttonBackground,
          },
          libraryText: palette.light.libraryText,
          deleteAccountBtn: {
            default: palette.light.deleteAccountBtn.default,
            hover: palette.light.deleteAccountBtn.hover,
          },
        }),
  },
});

declare module "@mui/material/styles" {
  interface Palette {
    landingAppBar: {
      background: string;
    };
    landingButton: {
      default: string;
      hover: string;
    };
    landingIcon: {
      background: string;
      backgroundHover: string;
    };
    landingDashboardIcon: {
      background: string;
      default: string;
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
    appBreadcrumb: {
      background: string;
    };
    appContainer: {
      background: string;
      border: string;
    };
    appLoginForm: {
      background: string;
      border: string;
      policyText: string;
      buttonBackground: string;
    };
    libraryText: string;
    deleteAccountBtn: {
      default: string;
      hover: string;
    };
  }

  interface PaletteOptions {
    landingAppBar: {
      background: string;
    };
    landingButton: {
      default: string;
      hover: string;
    };
    landingIcon: {
      background: string;
      backgroundHover: string;
    };
    landingDashboardIcon: {
      background: string;
      default: string;
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
    appBreadcrumb: {
      background: string;
    };
    appContainer: {
      background: string;
      border: string;
    };
    appLoginForm: {
      background: string;
      border: string;
      policyText: string;
      buttonBackground: string;
    };
    libraryText: string;
    deleteAccountBtn: {
      default: string;
      hover: string;
    };
  }
}

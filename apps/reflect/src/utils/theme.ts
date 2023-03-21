import { createTheme } from "@mui/material/styles";

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

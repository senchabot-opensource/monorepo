import "./App.css";
import { appStyle } from "./styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { Theme } from "./utils/theme.class";
import { useEffect, useMemo, useState } from "react";
import { RunContext } from "./contexts/RunContext";
import { InfoBoxContextProvider } from "./contexts/InfoBoxContext";
import { ResponseProvider } from "./contexts/ResponseContext";
import { useResponseContext } from "./contexts/ResponseContext";
import OutputCorner from "./components/ui/OutputCorner";
import { IMainColor } from "./types";
import { ModeContextProvider } from "./contexts/ModeContext";
import { BootText } from "./components/ui/scenes/BootText";
import Main from "./components/Main";
import { bootTexts } from "./utils/boottexts";

let muiTheme = createTheme({
  palette: {
    primary: {
      main: "#FFF",
    },
    background: {
      default: "#000",
    },
  },
});

const updateColors = (data: IMainColor) => {
  muiTheme = createTheme({
    palette: {
      primary: {
        main: data.foreground ?? "#FFF",
      },
      background: {
        default: data.background ?? "#000",
      },
    },
  });
};

function App() {
  const theme = new Theme(useResponseContext);
  const themeColors = theme.getColors();
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const runContext = useMemo(() => ({ isRunning, setIsRunning }), [isRunning]);

  useEffect(() => {
    updateColors(themeColors);

    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, [themeColors]);

  return (
    <>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {isLoading ? (
          <BootText texts={bootTexts(theme.themeName)} />
        ) : (
          <ModeContextProvider>
            <RunContext.Provider value={runContext}>
              <ResponseProvider>
                <InfoBoxContextProvider>
                  <OutputCorner />
                  <Main />
                </InfoBoxContextProvider>
              </ResponseProvider>
            </RunContext.Provider>
          </ModeContextProvider>
        )}
      </ThemeProvider>
    </>
  );
}

export default App;

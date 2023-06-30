import React, { ReactNode, createContext, useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getDesignTokens, getThemedComponents } from "src/utils/theme";

interface ColorModeContextType {
  toggleColorMode: () => void;
  colorMode: "dark" | "light";
}

export const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
  colorMode: "dark",
});

export const ColorModeProvider = ({ children }: { children: ReactNode }) => {
  const [colorMode, setColorMode] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const localColorMode = localStorage.getItem("theme");
    if (localColorMode) {
      setColorMode(localColorMode as "light" | "dark");
    }
  }, []);

  const toggleColorMode = () => {
    const newColorMode = colorMode === "light" ? "dark" : "light";
    setColorMode(colorMode === "light" ? "dark" : "light");
    localStorage.setItem("theme", newColorMode);
  };

  const theme = React.useMemo(
    () =>
      createTheme(getDesignTokens(colorMode), getThemedComponents(colorMode)),
    [colorMode],
  );

  return (
    <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

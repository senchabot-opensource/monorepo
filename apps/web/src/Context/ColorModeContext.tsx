import React, {
  FC,
  ReactNode,
  createContext,
  useEffect,
  useState,
} from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getDesignTokens, getThemedComponents } from "src/utils/theme";

type ColorMode = "light" | "dark";

interface ColorModeContextType {
  toggleColorMode: () => void;
  colorMode: ColorMode;
}

export const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
  colorMode: "dark",
});

export const ColorModeProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [colorMode, setColorMode] = useState<ColorMode>("dark");

  useEffect(() => {
    const localColorMode = localStorage.getItem("theme") as ColorMode;
    if (localColorMode) {
      setColorMode(localColorMode);
    }
  }, []);

  const toggleColorMode = () => {
    const newColorMode: ColorMode = colorMode === "light" ? "dark" : "light";
    setColorMode(newColorMode);
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

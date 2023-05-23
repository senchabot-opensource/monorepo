import { CssBaseline, ThemeProvider } from "@mui/material";
import LandingAppBar from "../../components/landing/LandingAppBar";
import { landingDarkTheme } from "../../utils/theme";
import VersionText from "../common/VersionText";
import { FC, ReactNode } from "react";
import LandingGrid from "./LandingGrid";

type IProps = {
  children: ReactNode;
};

const LandingContainer: FC<IProps> = ({ children }) => {
  return (
    <ThemeProvider theme={landingDarkTheme}>
      <CssBaseline />
      <LandingAppBar />
      <LandingGrid>{children}</LandingGrid>
      <VersionText />
    </ThemeProvider>
  );
};

export default LandingContainer;

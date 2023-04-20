import { CssBaseline, ThemeProvider } from "@mui/material";
import { LandingGrid } from "../../components/landing/LandingGrid";
import LandingAppBar from "../../components/landing/LandingAppBar";
import { landingDarkTheme } from "../../utils/theme";
import VersionText from "../common/VersionText";
import { ILandingContainer } from "src/types";

const LandingContainer = ({ children }: ILandingContainer) => {
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

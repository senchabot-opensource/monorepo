import { CssBaseline, ThemeProvider } from "@mui/material";
import LandingAppBar from "../../components/landing/LandingAppBar";
import VersionText from "../common/VersionText";
import { FC, ReactNode } from "react";
import LandingGrid from "./LandingGrid";
import { landingTheme } from "../../utils/landingTheme";
import LandingFooter from "./LandingFooter";

type IProps = {
  children: ReactNode;
};

const LandingContainer: FC<IProps> = ({ children }) => {
  return (
    <>
      <ThemeProvider theme={landingTheme}>
        <CssBaseline />
        <LandingAppBar />
        <LandingGrid>{children}</LandingGrid>
        <VersionText />
        <LandingFooter />
      </ThemeProvider>
    </>
  );
};

export default LandingContainer;

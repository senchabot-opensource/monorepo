import { CssBaseline } from "@mui/material";
import LandingAppBar from "../../components/landing/LandingAppBar";
import VersionText from "../common/VersionText";
import { FC, ReactNode } from "react";
import LandingGrid from "./LandingGrid";

type IProps = {
  children: ReactNode;
};

const LandingContainer: FC<IProps> = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <LandingAppBar />
      <LandingGrid>{children}</LandingGrid>
      <VersionText />
    </>
  );
};

export default LandingContainer;

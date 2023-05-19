import { Grid } from "@mui/material";
import { FC, ReactNode } from "react";

type IProps = {
  children: ReactNode;
};

const LandingGrid: FC<IProps> = ({ children }) => (
  <Grid
    container
    direction="column"
    justifyContent="flex-end"
    sx={{
      pl: { xs: "10px", md: "16vh" },
      pr: { xs: "none", md: "16vh" },
      pb: { xs: "64px", md: "128px" },
      overflowWrap: "break-word",
      whiteSpace: "pre-line",
    }}>
    {children}
  </Grid>
);

export default LandingGrid;

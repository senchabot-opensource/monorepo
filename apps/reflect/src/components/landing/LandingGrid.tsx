import { Grid } from "@mui/material";
import React from "react";

export const LandingGrid = ({ children }: { children: React.ReactNode }) => (
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
      margin: "10px",
    }}
  >
    {children}
  </Grid>
);

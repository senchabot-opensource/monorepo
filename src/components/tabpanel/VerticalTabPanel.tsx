import React from "react";
import { Box } from "@mui/material";

interface VerticalTabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function VerticalTabPanel(props: VerticalTabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <>
          <Box sx={{ pl: 3, display: { xs: "none", md: "block" } }}>
            {children}
          </Box>
          <Box sx={{ pl: 0, display: { xs: "block", md: "none" } }}>
            {children}
          </Box>
        </>
      )}
    </div>
  );
}

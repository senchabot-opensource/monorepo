import React from "react";
import { Box } from "@mui/material";
import { FC, ReactNode } from "react";

type IProps = {
  children?: ReactNode;
  index: number;
  value: number;
  other?: any;
};

const VerticalTabPanel: FC<IProps> = ({ children, index, value, other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}>
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
};

export default VerticalTabPanel;

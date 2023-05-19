import Box from "@mui/material/Box";
import { FC, ReactNode } from "react";

type IProps = {
  children?: ReactNode;
  index: number;
  value: number;
  other?: any;
};

const HorizontalTabPanel: FC<IProps> = ({ children, value, index, other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`horizontal-tabpanel-${index}`}
      aria-labelledby={`horizontal-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export default HorizontalTabPanel;

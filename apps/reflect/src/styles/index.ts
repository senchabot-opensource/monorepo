import { alpha } from "@mui/material";

export const AppBarStyles = {
  backdropFilter: "blur(4px)",
  backgroundColor: alpha("#000", 0.75),
};

export const MenuPaperPropsStyles = {
  elevation: 1,
  sx: {
    overflow: "visible",
    filter: "drop-shadow(0px, 2px, 8px rgba(0,0,0,0.32))",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",

    backgroundColor: "#000",

    mt: 1,

    "& .MuiAvatar-root": {
      width: 28,
      height: 28,
      ml: -0.5,
      mr: 1.5,
    },
    /*"&:before": {
      content: '""',
      display: "block",
      position: "absolute",
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: "background.paper",
      transform: "translateY(-50%) rotate(45deg)",
      zIndex: 0,
    },*/
  },
};

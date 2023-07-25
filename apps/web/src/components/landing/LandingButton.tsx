import { Button, ButtonProps } from "@mui/material";
import { grey } from "@mui/material/colors";
import { alpha, styled } from "@mui/material/styles";

const LandingButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(grey[500]),
  boxShadow: "none",
  backgroundColor: alpha("#000000", 0),
  fontStyle: "italic",
  "&:hover": {
    backgroundColor: alpha("#000000", 0),
    border: "none",
    boxShadow: "none",
    color: "landingButton.hover",
  },
}));

export default LandingButton;

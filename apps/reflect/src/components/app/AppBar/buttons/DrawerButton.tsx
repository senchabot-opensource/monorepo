import { IconButton, Box } from "@mui/material";
import { BootstrapTooltip } from "../../../Tooltip";
import { FC } from "react";
import MenuIcon from "@mui/icons-material/Menu";

type IProps = {
  onClick: () => void;
};

const DrawerButton: FC<IProps> = ({ onClick }) => {
  return (
    <BootstrapTooltip title="Open the menu">
      <Box>
        <IconButton onClick={onClick}>
          <MenuIcon />
        </IconButton>
      </Box>
    </BootstrapTooltip>
  );
};

export default DrawerButton;

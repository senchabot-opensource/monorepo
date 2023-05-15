import { Drawer, IconButton, Box } from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { BootstrapTooltip } from "../../../Tooltip";
import { FC } from "react";

type IProps = {
  onClick: () => void;
};

const DrawerButton: FC<IProps> = ({ onClick }) => {
  return (
    <BootstrapTooltip title="Open the menu">
      <Box>
        <IconButton onClick={onClick}>
          <FormatListBulletedIcon />
        </IconButton>
      </Box>
    </BootstrapTooltip>
  );
};

export default DrawerButton;

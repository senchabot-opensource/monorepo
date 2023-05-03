import { IconButton, Typography } from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Link from "next/link";
import { BootstrapTooltip } from "../../../Tooltip";

const CommandListButton = () => {
  return (
    <BootstrapTooltip title="Bot Command List">
      <Typography>
        <Link href="/app/command-list" passHref>
          <IconButton aria-label="bot command list">
            <FormatListBulletedIcon />
          </IconButton>
        </Link>
      </Typography>
    </BootstrapTooltip>
  );
};

export default CommandListButton;

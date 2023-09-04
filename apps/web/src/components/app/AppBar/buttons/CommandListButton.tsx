import { IconButton, Typography } from "@mui/material";
import Link from "next/link";
import { SiDiscord } from "react-icons/si";
import { BootstrapTooltip } from "src/components/Tooltip";
import { env } from "../../../../env/client.mjs";
import { BsListNested } from "react-icons/bs";
const CommandListButton = () => {
  return (
    <BootstrapTooltip title="Command List Page">
      <Typography>
        <Link href="/app/command-list" passHref>
          <IconButton
            aria-label="command list page"
            sx={{
              display: "flex",
            }}>
            <BsListNested />
          </IconButton>
        </Link>
      </Typography>
    </BootstrapTooltip>
  );
};

export default CommandListButton;

import { IconButton, Typography } from "@mui/material";
import Link from "next/link";
import { BootstrapTooltip } from "../../Tooltip";
import { IAppBarButton } from "../../../types";

const AppBarButton = ({
  title,
  pathHref,
  ariaLabel,
  drawerHandler,
  children,
}: IAppBarButton) => {
  return (
    <BootstrapTooltip title={title}>
      <Typography>
        <Link href={pathHref}>
          <IconButton
            aria-label={ariaLabel}
            onClick={drawerHandler}
            sx={{
              display: { xs: "none", md: "flex" },
            }}>
            {children}
          </IconButton>
        </Link>
      </Typography>
    </BootstrapTooltip>
  );
};

export default AppBarButton;

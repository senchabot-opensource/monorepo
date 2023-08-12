import { IconButton, Typography } from "@mui/material";
import Link from "next/link";
import { BootstrapTooltip } from "../../Tooltip";
import React from "react";
import { FC, ReactNode } from "react";

type IProps = {
  title: string;
  pathHref: string;
  ariaLabel: string;
  drawerHandler: () => void;
  children: ReactNode;
};

const AppBarButton: FC<IProps> = ({
  title,
  pathHref,
  ariaLabel,
  drawerHandler,
  children,
}) => {
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

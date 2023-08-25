import { Typography } from "@mui/material";
import Link from "next/link";
import { env } from "../../env/client.mjs";

const Logo = () => {
  return (
    <>
      {/* Desktop and Tablet view */}
      <Typography
        variant="h5"
        noWrap
        sx={{
          pr: { sm: 4, md: 0 },
          mr: { sm: 4, md: 2 },
          display: { xs: "none", sm: "none", md: "flex" },
          fontFamily: "Source Code Pro",
          fontStyle: "italic",
          fontWeight: 700,
          letterSpacing: ".1rem",
          color: "inherit",
          textDecoration: "none",
        }}>
        <Link href="/">{env.NEXT_PUBLIC_APP_NAME}</Link>
      </Typography>
      {/* Mobile view */}
      <Typography
        variant="h6"
        noWrap
        sx={{
          flexGrow: 1,
          mr: 2,
          display: { xs: "flex", sm: "flex", md: "none" },
          fontFamily: "Source Code Pro",
          fontStyle: "italic",
          fontWeight: 700,
          letterSpacing: ".1rem",
          color: "inherit",
          textDecoration: "none",
        }}>
        <Link href="/">{env.NEXT_PUBLIC_APP_NAME}</Link>
      </Typography>
    </>
  );
};

export default Logo;

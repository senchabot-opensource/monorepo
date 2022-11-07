import { Typography } from "@mui/material";
import Link from "next/link";
import { env } from "../../env/client.mjs";

const AppBarTitle = () => {
  return (
    <>
      {/* Desktop and Tablet view */}
      <Typography
        variant="h5"
        noWrap
        sx={{
          mr: 2,
          display: { xs: "none", md: "flex" },
          fontFamily: "Source Code Pro",
          fontStyle: "italic",
          fontWeight: 700,
          letterSpacing: ".1rem",
          color: "inherit",
          textDecoration: "none",
          //...(isDrawerOpen && { display: "none" }),
        }}
      >
        <Link href="/">{env.NEXT_PUBLIC_APP_NAME}</Link>
      </Typography>
      {/* Mobile view */}
      <Typography
        variant="h6"
        noWrap
        sx={{
          mr: 2,
          display: { xs: "flex", md: "none" },
          flexGrow: 1,
          fontFamily: "Source Code Pro",
          fontStyle: "italic",
          fontWeight: 700,
          letterSpacing: ".1rem",
          color: "inherit",
          textDecoration: "none",
          //...(isDrawerOpen && { display: "none" }),
        }}
      >
        <Link href="/">{env.NEXT_PUBLIC_APP_NAME}</Link>
      </Typography>
    </>
  );
};

export default AppBarTitle;

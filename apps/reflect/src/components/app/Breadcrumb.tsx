import { Breadcrumbs, Link as MuiLink } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

const Breadcrumb = () => {
  const router = useRouter();
  const pathName = router.pathname;
  const pathNames = pathName.split("/").slice(1);
  const pathLength = pathNames.length;

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{ ml: 1, backgroundColor: "appBreadcrumb.background" }}>
      {pathNames.map((path, index) => (
        <Link
          key={index}
          href={`${pathLength - 1 === index ? pathName : "/" + path}`}>
          <MuiLink
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color={pathLength - 1 === index ? "text.primary" : "inherit"}>
            {path.charAt(0).toLocaleUpperCase() + path.slice(1)}
          </MuiLink>
        </Link>
      ))}
    </Breadcrumbs>
  );
};

export default Breadcrumb;

import { Breadcrumbs, Link as MuiLink } from "@mui/material";
import Link from "next/link";
/*import WhatshotIcon from "@mui/icons-material/Whatshot";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
*/ import { useRouter } from "next/router";

/*function checkAttributes(pathLength: number, index: number) {
  if (pathLength - 1 === index) {
    return { "aria-current": "page" };
  }
  return null;
}*/

const Breadcrumb = () => {
  const router = useRouter();
  const pathName = router.pathname;
  const pathNames = pathName.split("/").slice(1);
  const pathLength = pathNames.length;

  // const nonWordPattern = /\W/g;
  // const pathDepth = pathName.match(nonWordPattern);
  // console.log("pathDepth", pathDepth);

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ ml: 1 }}>
      {pathNames.map((path, index) => (
        <Link
          key={index}
          href={`${pathLength - 1 === index ? pathName : "/" + path}`}
        >
          <MuiLink
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color={pathLength - 1 === index ? "text.primary" : "inherit"}
          >
            {path.charAt(0).toLocaleUpperCase() + path.slice(1)}
          </MuiLink>
        </Link>
      ))}
    </Breadcrumbs>
  );
};

export default Breadcrumb;

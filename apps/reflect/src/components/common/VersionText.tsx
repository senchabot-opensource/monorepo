import { Typography } from "@mui/material";
import { env } from "../../env/client.mjs";

const VersionText = () => {
  return (
    <Typography sx={{ position: "fixed", bottom: 16, right: 16 }}>
      {env.NEXT_PUBLIC_APP_VERSION}
    </Typography>
  );
};

export default VersionText;

import { Typography } from "@mui/material";
import { ReactElement } from "react";

const FormTitle = ({ titleText }: { titleText: string }) => {
  return (
    <Typography variant="h6" sx={{ mb: 2 }}>
      {titleText}
    </Typography>
  );
};

export default FormTitle;

import { Typography } from "@mui/material";
import { FC } from "react";

type IProps = {
  titleText: string;
};

const FormTitle: FC<IProps> = ({ titleText }) => {
  return (
    <Typography variant="h6" sx={{ mb: 2 }}>
      {titleText}
    </Typography>
  );
};

export default FormTitle;

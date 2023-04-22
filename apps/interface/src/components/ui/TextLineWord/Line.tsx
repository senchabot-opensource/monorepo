import { useTheme } from "@mui/material";
import { FC } from "react";

import { textLineStyle } from "../../../styles";
import { ITextLineProps } from "../../../types";

const Line: FC<ITextLineProps> = props => {
  const theme = useTheme();
  const primaryMainColor = theme.palette.primary.main;

  return (
    <div
      className={`${props.textWord ? "" : "lineAnimation"}`}
      style={textLineStyle(primaryMainColor, props)}
    />
  );
};

export default Line;

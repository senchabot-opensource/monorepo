import { useTheme } from "@mui/material";
import { FC } from "react";

import { textWordStyle } from "../../../styles";
import { ITextWordProps } from "../../../types";

const Word: FC<ITextWordProps> = props => {
  const theme = useTheme();
  const primaryMainColor = theme.palette.primary.main;

  return <div style={textWordStyle(primaryMainColor)}>{props.textWord}</div>;
};

export default Word;

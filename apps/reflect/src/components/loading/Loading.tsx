import { Backdrop, CircularProgress } from "@mui/material";
import { FC } from "react";

type IProps = {
  isLoading: boolean;
  isAuthLoading: string;
};

const Loading: FC<IProps> = ({ isLoading, isAuthLoading }) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}
      open={isLoading || isAuthLoading === "loading"}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;

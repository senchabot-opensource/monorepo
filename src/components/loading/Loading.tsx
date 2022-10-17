import { Backdrop, CircularProgress } from "@mui/material";

const Loading = ({
  isLoading,
  isAuthLoading,
}: {
  isLoading: boolean;
  isAuthLoading: string;
}) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isLoading || isAuthLoading === "loading"}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;

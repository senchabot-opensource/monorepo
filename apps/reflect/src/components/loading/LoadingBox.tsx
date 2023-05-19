import { Box, CircularProgress } from "@mui/material";

const LoadingBox = () => {
  return (
    <Box
      sx={{
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        paddingBottom: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <CircularProgress color="inherit" />
    </Box>
  );
};

export default LoadingBox;

import { FC, ReactNode } from "react";
import { Button, Stack, Typography } from "@mui/material";

type IProps = {
  content: string;
  icon: ReactNode;
  onClick: () => void;
  fullWidth?: boolean;
};

const AuthLoginButton: FC<IProps> = ({ content, icon, onClick, fullWidth }) => {
  return (
    <Stack
      onClick={onClick}
      padding={1.5}
      spacing={2}
      direction="row"
      alignItems="center"
      sx={{
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#202020",
          borderRadius: "4px",
        },
      }}>
      {icon}
      <Typography
        sx={{
          color: "white",
          width: fullWidth ? "100%" : "fit-content",
          textAlign: "left",
        }}>
        {content}
      </Typography>
    </Stack>
  );
};

export default AuthLoginButton;

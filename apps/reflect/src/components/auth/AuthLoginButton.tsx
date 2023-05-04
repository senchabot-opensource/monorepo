import { FC, ReactNode } from "react";
import { Button } from "@mui/material";

type IProps = {
  content: string;
  icon: ReactNode;
  onClick: () => void;
  fullWidth?: boolean;
};

const AuthLoginButton: FC<IProps> = ({ content, icon, onClick, fullWidth }) => {
  return (
    <Button
      onClick={onClick}
      startIcon={icon}
      size="large"
      sx={{
        color: "white",
        width: fullWidth ? "100%" : "fit-content",
        textAlign: "left",
        "&:hover": {
          backgroundColor: "#202020",
        },
      }}>
      {content}
    </Button>
  );
};

export default AuthLoginButton;

import { FC } from "react";
import { Stack, Typography } from "@mui/material";
import { IconBaseProps, IconType } from "react-icons";

type IProps = {
  content: string;
  icon: IconType;
  iconProps?: IconBaseProps;
  onClick: () => void;
  fullWidth?: boolean;
  disabled?: boolean;
};

const AuthLoginButton: FC<IProps> = ({
  content,
  icon: Icon,
  iconProps,
  onClick,
  fullWidth,
  disabled,
}) => {
  return (
    <Stack
      onClick={!disabled ? onClick : undefined}
      padding={1.5}
      spacing={2}
      direction="row"
      alignItems="center"
      sx={{
        ...(!disabled
          ? {
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#202020",
                borderRadius: "4px",
              },
            }
          : { cursor: "not-allowed", color: "gray" }),
      }}>
      {<Icon {...iconProps} {...(disabled && { color: "gray" })} />}
      <Typography
        sx={{
          width: fullWidth ? "100%" : "fit-content",
          textAlign: "left",
        }}>
        {content}
      </Typography>
    </Stack>
  );
};

export default AuthLoginButton;

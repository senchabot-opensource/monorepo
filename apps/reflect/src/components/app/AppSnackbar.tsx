import React from "react";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import { Slide, SlideProps } from "@mui/material";

type TransitionProps = Omit<SlideProps, "direction">;

function TransitionUp(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

const AppSnackbar = ({
  isSnackbarOpen,
  snackbarMessage,
}: {
  isSnackbarOpen: boolean;
  snackbarMessage: string;
}) => {
  const [open, setOpen] = React.useState(false);
  const [transition, setTransition] = React.useState<
    React.ComponentType<TransitionProps> | undefined
  >(undefined);

  React.useEffect(() => {
    setTransition(() => TransitionUp);
  }, [isSnackbarOpen]);

  const handleClose = () => {};

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      TransitionComponent={transition}
      autoHideDuration={3200}
      message={snackbarMessage}
      key={transition ? transition.name : ""}
    />
  );
};

export default AppSnackbar;

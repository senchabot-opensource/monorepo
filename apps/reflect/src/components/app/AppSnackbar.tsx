import React from "react";
import Snackbar from "@mui/material/Snackbar";
import { Alert, Slide, SlideProps } from "@mui/material";
import { FC } from "react";
import { SneacbarSeverity } from "../../enums";

type TransitionProps = Omit<SlideProps, "direction">;

function TransitionUp(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

type IProps = {
  isSnackbarOpen: boolean;
  snackbarMessage: string;
  snackbarClose: () => void;
  severity: SneacbarSeverity;
};

const AppSnackbar: FC<IProps> = ({
  isSnackbarOpen,
  snackbarMessage,
  snackbarClose,
  severity,
}) => {
  const [transition, setTransition] = React.useState<
    React.ComponentType<TransitionProps> | undefined
  >(undefined);

  React.useEffect(() => {
    setTransition(() => TransitionUp);
  }, [isSnackbarOpen]);

  return (
    <Snackbar
      open={isSnackbarOpen}
      onClose={snackbarClose}
      TransitionComponent={transition}
      autoHideDuration={6000}
      key={transition ? transition.name : ""}>
      <Alert severity={severity}>{snackbarMessage}</Alert>
    </Snackbar>
  );
};

export default AppSnackbar;

import React from "react";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import { Slide, SlideProps } from "@mui/material";
/*import {
  useSnackbarContext,
  useSnackbarDispatchContext,
} from "../../contexts/SnackbarContext";*/

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
  //const snackbarContext = useSnackbarContext();

  //const { status: open } = snackbarContext;
  //const { setSnackbarData } = useSnackbarDispatchContext();
  const [open, setOpen] = React.useState(false);
  const [transition, setTransition] = React.useState<
    React.ComponentType<TransitionProps> | undefined
  >(undefined);

  /*const [snackbarState, setSnackbarState] = React.useState<SnackbarOrigin>({
    vertical: "bottom",
    horizontal: "left",
  });*/

  //const { vertical, horizontal } = snackbarState;

  React.useEffect(() => {
    setTransition(() => TransitionUp);
    //setOpen(isSnackbarOpen);
    //setSnackbarData({ status: isSnackbarOpen, message: snackbarMessage });
  }, [isSnackbarOpen]);

  /*const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    //setSnackbarState({ ...snackbarState, open: false });
  };*/

  /*const handleOpen =
    (Transition: React.ComponentType<TransitionProps>) => () => {
      setTransition(() => Transition);
      setOpen(true);
      //setOpen(!isSnackbarOpen);
    };*/

  const handleClose = () => {
    //setOpen(false);
    //setSnackbarData({ status: false, message: "" });
  };

  return (
    <Snackbar
      //anchorOrigin={{ vertical, horizontal }}
      open={open}
      onClose={handleClose}
      TransitionComponent={transition}
      autoHideDuration={3200}
      message={snackbarMessage}
      key={transition ? transition.name : ""}
      //key={vertical + horizontal}
    />
  );
};

export default AppSnackbar;

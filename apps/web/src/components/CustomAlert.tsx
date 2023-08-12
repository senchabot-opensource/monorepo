import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { FC } from "react";

type IProps = {
  title?: string;
  content: string;
  isOpen: boolean;
  closeHandler: () => void;
};

const CustomAlert: FC<IProps> = ({ title, content, isOpen, closeHandler }) => {
  return (
    <Dialog open={isOpen} onClose={closeHandler}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeHandler}>ok</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomAlert;

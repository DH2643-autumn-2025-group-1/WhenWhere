import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import styled from "styled-components";

export default function AlertDialog({
  open,
  setOpen,
  onAgree,
  title,
  description,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAgree: () => void;
  title?: string;
  description?: string;
}) {
  const handleClose = () => {
    setOpen(false);
    onAgree();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <StyledAgreeButton onClick={handleClose} autoFocus>
          Agree
        </StyledAgreeButton>
      </DialogActions>
    </Dialog>
  );
}

const StyledAgreeButton = styled(Button)`
  color: ${({ theme }) => theme.colors.danger};
`;

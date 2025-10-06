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
  itemToDelete,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAgree: () => void;
  itemToDelete?: string;
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
      <DialogTitle id="alert-dialog-title">Remove event?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {itemToDelete
            ? `Are you sure you want to remove \"${itemToDelete}\"? This action cannot be
          undone.`
            : `Are you sure you want to remove this event? This action cannot be
          undone.`}
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

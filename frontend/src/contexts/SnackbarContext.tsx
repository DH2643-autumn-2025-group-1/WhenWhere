import { useState, type ReactNode } from "react";
import { Snackbar, Alert } from "@mui/material";
import styled from "styled-components";
import { SnackbarContext } from "./useSnackbar";

const LargeAlert = styled(Alert)`
  min-width: 450px !important;
  font-size: 16px;
  padding: 20px 30px;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);

  .MuiAlert-message {
    font-size: 20px;
    font-weight: 500;
    line-height: 1.4;
  }

  .MuiAlert-icon {
    font-size: 24px;
  }

  .MuiAlert-action {
    padding-left: 16px;
  }
`;

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <LargeAlert onClose={handleClose} severity={snackbar.severity}>
          {snackbar.message}
        </LargeAlert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

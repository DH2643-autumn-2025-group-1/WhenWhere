import { createContext, useContext } from "react";

interface SnackbarContextType {
  showSnackbar: (message: string, severity: "success" | "error") => void;
}

export const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined,
);

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
}

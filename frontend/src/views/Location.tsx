import { forwardRef } from "react";
import { TextField } from "@mui/material";

export interface LocationViewProps {
  label: string;
  defaultValue?: string;
  onBlur: () => void;
}

export const LocationView = forwardRef<HTMLInputElement, LocationViewProps>(
  function LocationView({ label, defaultValue, onBlur }, ref) {
    return (
      <div className="autocomplete-container">
        <TextField
          inputRef={ref}
          label={label}
          variant="outlined"
          fullWidth
          margin="normal"
          defaultValue={defaultValue}
          onBlur={onBlur}
        />
      </div>
    );
  },
);
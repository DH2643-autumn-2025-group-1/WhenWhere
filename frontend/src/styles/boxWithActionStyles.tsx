import { styled } from "@mui/material/styles";
import { Paper, Stack, Typography, TextField } from "@mui/material";

export const StyledContainer = styled(Stack)(() => ({
  width: "fit-content",
  alignItems: "flex-start",
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  paddingLeft: theme.spacing(0.5),
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  width: "fit-content",
}));

export const StyledTextField = styled(TextField)(() => ({
  "& .MuiInputBase-input": {
    textAlign: "center",
    minWidth: "4ch",
  },
}));

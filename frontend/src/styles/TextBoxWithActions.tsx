import { styled } from "@mui/material/styles";
import { Paper, Typography, TextField } from "@mui/material";

export const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.common.black,
  alignSelf: "center",
  textAlign: "center",
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: theme.spacing(1),
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  borderRadius: "20px",
  backgroundColor: "white",
  width: "100%",
}));

export const StyledTextField = styled(TextField)(() => ({
  "& .MuiInputBase-input": {
    textAlign: "center",
    minWidth: "4ch",
  },
}));

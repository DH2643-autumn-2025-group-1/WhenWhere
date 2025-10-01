import { Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledTitle = styled(Typography)(() => ({
  fontWeight: 600,
}));

export const StyledSubtitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.text.secondary,
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  textTransform: "none",
}));
import { createTheme } from "@mui/material";

export const theme = {
  colors: {
    primary: "#4a90e2",
    secondary: "#cceafd",
    background: "#f5f5f5",
    warning: "#f1c40f",
    danger: "#e74c3c",
  },
  spacing: {
    small: "8px",
    medium: "16px",
    large: "24px",
    xlarge: "32px",
  },
  fontSizes: {
    small: "12px",
    medium: "16px",
    large: "20px",
    xlarge: "24px",
  },
  fonts: {
    family:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  breakpoints: {
    mobile: "600px",
    tablet: "900px",
    desktop: "1200px",
  },
};

export type ThemeType = typeof theme;

export const muiTheme = createTheme({
  typography: {
    fontFamily: theme.fonts.family,
  },
});

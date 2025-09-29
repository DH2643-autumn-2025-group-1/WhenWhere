import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme.ts";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  THEME_ID,
} from "@mui/material";

const muiTheme = createTheme({});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <MuiThemeProvider theme={{ [THEME_ID]: muiTheme }}>
        <App />
      </MuiThemeProvider>
    </ThemeProvider>
  </StrictMode>,
);

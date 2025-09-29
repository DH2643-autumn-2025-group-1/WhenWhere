import App from "./App.tsx";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme.ts";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  THEME_ID,
} from "@mui/material";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

const muiTheme = createTheme({});

const root = document.getElementById("root");

if (!root) throw new Error("Failed to find the root element");

ReactDOM.createRoot(root).render(
  <ThemeProvider theme={theme}>
    <MuiThemeProvider theme={{ [THEME_ID]: muiTheme }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </BrowserRouter>
    </MuiThemeProvider>
  </ThemeProvider>,
);

import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Root } from "./views/Root.tsx";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  THEME_ID,
} from "@mui/material";
import { StyledEngineProvider } from "@mui/styled-engine-sc";
import { theme } from "./styles/theme.ts";
import { initAuthListener } from "./firebase/firebaseAuth";
import { eventModel } from "./models/EventModel.ts";

const root = document.getElementById("root");
if (!root) throw new Error("Failed to find the root element");

const GlobalStyle = createGlobalStyle<{ appBarHeight?: number }>`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    width: 100%;
    background-color: ${(props) => props.theme.colors.background};
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }
`;

const muiTheme = createTheme({
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

initAuthListener(eventModel);

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <MuiThemeProvider theme={{ [THEME_ID]: muiTheme }}>
          <GlobalStyle />
          <Root model={eventModel} />
        </MuiThemeProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  </BrowserRouter>,
);

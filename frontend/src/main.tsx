import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import styled, { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme.ts";
import {
  AppBar,
  createTheme,
  ThemeProvider as MuiThemeProvider,
  THEME_ID,
} from "@mui/material";

const StyledAppBar = styled(AppBar)`
  background-color: ${(props) => props.theme.colors.primary};
  padding: ${(props) => props.theme.spacing.medium};
  font-size: ${(props) => props.theme.fontSizes.xlarge};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const LinkContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${(props) => props.theme.spacing.large};
`;

const NavigationLink = styled.span`
  font-size: ${(props) => props.theme.fontSizes.large};
`;

const muiTheme = createTheme({});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <MuiThemeProvider theme={{ [THEME_ID]: muiTheme }}>
        <StyledAppBar position="static">
          WhenWhere
          <LinkContainer>
            <NavigationLink>My events</NavigationLink>
            <NavigationLink>Log in/out</NavigationLink>
          </LinkContainer>
        </StyledAppBar>
        <App />
      </MuiThemeProvider>
    </ThemeProvider>
  </StrictMode>,
);

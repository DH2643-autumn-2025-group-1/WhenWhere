import App from "./App.tsx";
import styled, { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme.ts";
import {
  AppBar,
  createTheme,
  ThemeProvider as MuiThemeProvider,
  THEME_ID,
} from "@mui/material";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

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

const root = document.getElementById("root");
if (!root) throw new Error("Failed to find the root element");

ReactDOM.createRoot(root).render(
  <ThemeProvider theme={theme}>
    <MuiThemeProvider theme={{ [THEME_ID]: muiTheme }}>
      <BrowserRouter>
        <StyledAppBar position="static">
          WhenWhere
          <LinkContainer>
            <NavigationLink>My events</NavigationLink>
            <NavigationLink>Log in/out</NavigationLink>
          </LinkContainer>
        </StyledAppBar>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </BrowserRouter>
    </MuiThemeProvider>
  </ThemeProvider>,
);

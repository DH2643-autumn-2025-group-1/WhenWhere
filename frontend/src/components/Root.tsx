import styled, { ThemeProvider } from "styled-components";
import {
  AppBar,
  createTheme,
  ThemeProvider as MuiThemeProvider,
  THEME_ID,
} from "@mui/material";
import { Route, Routes, useNavigate } from "react-router";
import { theme } from "../styles/theme.ts";
import App from "./App.tsx";

const StyledAppBar = styled(AppBar)`
  background-color: ${(props) => props.theme.colors.primary};
  padding: ${(props) => props.theme.spacing.medium};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  all: unset;
  font-size: ${(props) => props.theme.fontSizes.xlarge};
  cursor: pointer;
  &&:hover {
    color: ${(props) => props.theme.colors.secondary};
  }
`;

const LinkContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${(props) => props.theme.spacing.large};
`;

const NavigationLink = styled.span`
  font-size: ${(props) => props.theme.fontSizes.large};
  cursor: pointer;
  &&:hover {
    color: ${(props) => props.theme.colors.secondary};
  }
`;

const muiTheme = createTheme({});

export function Root() {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <MuiThemeProvider theme={{ [THEME_ID]: muiTheme }}>
        <StyledAppBar position="static">
          <Title onClick={() => navigate("/")}>WhenWhere</Title>
          <LinkContainer>
            <NavigationLink
              onClick={() => console.error("Not implemented yet")}
            >
              My events
            </NavigationLink>
            <NavigationLink onClick={() => navigate("/login")}>
              Log in/out
            </NavigationLink>
          </LinkContainer>
        </StyledAppBar>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MuiThemeProvider>
    </ThemeProvider>
  );
}

import styled, { css, ThemeProvider } from "styled-components";
import {
  AppBar,
  createTheme,
  ThemeProvider as MuiThemeProvider,
  THEME_ID,
} from "@mui/material";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { theme } from "../styles/theme.ts";
import App from "./App.tsx";
import { Login } from "./Login.tsx";
import { AvailabilityPresenter } from "../presenters/AvailabilityPresenter";
import { eventModel } from "../models/EventModel.ts";
import { HomepagePresenter } from "../presenters/HomepagePresenter.tsx";
import { EventPresenter } from "../presenters/EventPresenter.tsx";
import { theme } from "../styles/theme.ts";

const muiTheme = createTheme();

const StyledAppBar = styled(AppBar)`
  background-color: ${(props) => props.theme.colors.primary};
  padding: ${(props) => props.theme.spacing.medium};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  max-width: 100vw;
  flex-wrap: wrap;
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

const NavigationLink = styled.span<{ $active?: boolean }>`
  font-size: ${(props) => props.theme.fontSizes.large};
  cursor: pointer;

  ${(props) =>
    props.$active &&
    css`
      color: ${props.theme.colors.secondary};
      font-weight: bold;
    `};

  &&:hover {
    color: ${(props) => props.theme.colors.secondary};
  }
`;

const muiTheme = createTheme({});

export function Root() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ThemeProvider theme={theme}>
      <MuiThemeProvider theme={{ [THEME_ID]: muiTheme }}>
        <StyledAppBar position="static" id="appBar">
          <Title onClick={() => navigate("/")}>WhenWhere</Title>
          <LinkContainer>
            <NavigationLink
              onClick={() => navigate("/events")}
              $active={location.pathname === "/events"}
            >
              My events
            </NavigationLink>
            <NavigationLink
              onClick={() => navigate("/login")}
              $active={location.pathname === "/login"}
            >
              Log in
            </NavigationLink>
          </LinkContainer>
        </StyledAppBar>
        <Routes>
          <Route path="/" element={<HomepagePresenter model={eventModel} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/events" element={<div>My Events Page</div>} />
          <Route
            path="/availability"
            element={<AvailabilityPresenter model={eventModel} />}
          />
          <Route path="/mark-availibility" element={<App />} />
          <Route path="/event-result" element={<div>event result</div>} />
          <Route
            path="/create-event"
            element={<EventPresenter model={eventModel} />}
          />
        </Routes>
      </MuiThemeProvider>
    </ThemeProvider>
  );
}

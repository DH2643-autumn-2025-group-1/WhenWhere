import { ThemeProvider } from "styled-components";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  THEME_ID,
} from "@mui/material";
import { Route, Routes } from "react-router";
import { theme } from "../styles/theme.ts";
import { Login } from "./Login.tsx";
import { eventModel } from "../models/EventModel.ts";
import { HomepagePresenter } from "../presenters/HomepagePresenter.tsx";
import { EventPresenter } from "../presenters/EventPresenter.tsx";
import { StyledEngineProvider } from "@mui/styled-engine-sc";
import { HeaderPresenter } from "../presenters/Header.tsx";
import { ProtectedRoute } from "../components/utils/ProtectedRoute.tsx";
import { VoteTimeAndPlacePresenter } from "../presenters/VoteTimeAndPlacePresenter.tsx";

const muiTheme = createTheme({});

export function Root() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <MuiThemeProvider theme={{ [THEME_ID]: muiTheme }}>
          <HeaderPresenter />
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomepagePresenter model={eventModel} />
                </ProtectedRoute>
              }
            />
            <Route path="/sign-in" element={<Login />} />
            <Route
              path="/availibility"
              element={
                <ProtectedRoute>
                  <VoteTimeAndPlacePresenter model={eventModel} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/event-result"
              element={
                <ProtectedRoute>
                  <div>event result</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-event"
              element={
                <ProtectedRoute>
                  <EventPresenter model={eventModel} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MuiThemeProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

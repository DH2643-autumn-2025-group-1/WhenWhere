import { ThemeProvider } from "styled-components";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  THEME_ID,
} from "@mui/material";
import { Route, Routes } from "react-router";
import { theme } from "../styles/theme.ts";
import { Login } from "./Login.tsx";
import { HomepagePresenter } from "../presenters/HomepagePresenter.tsx";
import { EventPresenter } from "../presenters/EventPresenter.tsx";
import { StyledEngineProvider } from "@mui/styled-engine-sc";
import { HeaderPresenter } from "../presenters/Header.tsx";
import { ProtectedRoute } from "../components/utils/ProtectedRoute.tsx";
import type { EventModelType } from "../models/EventModel";

const muiTheme = createTheme({});

export function Root({ model }: { model: EventModelType }) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <MuiThemeProvider theme={{ [THEME_ID]: muiTheme }}>
          <HeaderPresenter model={model} />
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomepagePresenter model={model} />
                </ProtectedRoute>
              }
            />
            <Route path="/sign-in" element={<Login />} />
            <Route
              path="/event-result"
              element={
                <ProtectedRoute>
                  <div>event result</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/availability"
              element={
                <ProtectedRoute>
                  <VoteTimeAndPlacePresenter model={model} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-event"
              element={
                <ProtectedRoute>
                  <EventPresenter model={model} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MuiThemeProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

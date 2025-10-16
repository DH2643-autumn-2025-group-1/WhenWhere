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
import { ScheduleEventPresenter } from "../presenters/ScheduleEventPresenter.tsx";
import { StyledEngineProvider } from "@mui/styled-engine-sc";
import { HeaderPresenter } from "../presenters/HeaderPresenter.tsx";
import { ProtectedRoute } from "../components/utils/ProtectedRoute.tsx";
import { EventResultPresenter } from "../presenters/EventResultPresenter.tsx";
import type { EventModelType } from "../models/EventModel";
import { VoteTimeAndPlacePresenter } from "../presenters/VoteTimeAndPlacePresenter.tsx";
import { SnackbarProvider } from "../contexts/SnackbarContext.tsx";

const muiTheme = createTheme({});

export function Root({ model }: { model: EventModelType }) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <MuiThemeProvider theme={{ [THEME_ID]: muiTheme }}>
          <SnackbarProvider>
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
                    <EventResultPresenter model={model} />
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
                    <ScheduleEventPresenter model={model} />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </SnackbarProvider>
        </MuiThemeProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

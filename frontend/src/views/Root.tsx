import { ThemeProvider } from "styled-components";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  THEME_ID,
} from "@mui/material";
import { Route, Routes } from "react-router";
import App from "./App.tsx";
import { Login } from "./LogIn.tsx";
import { AvailabilityPresenter } from "../presenters/AvailabilityPresenter";
import { eventModel } from "../models/EventModel.ts";
import { HomepagePresenter } from "../presenters/HomepagePresenter.tsx";
import { EventPresenter } from "../presenters/EventPresenter.tsx";
import { theme } from "../styles/theme.ts";
import { HeaderPresenter } from "../presenters/Header.tsx";
import { ProtectedRoute } from "../components/utils/ProtectedRoute.tsx";

const muiTheme = createTheme({});

export function Root() {
  return (
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
            path="/mark-availibility"
            element={
              <ProtectedRoute>
                <App />
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
          <Route path="/events" element={<div>My Events Page</div>} />
          <Route
            path="/availability"
            element={<AvailabilityPresenter model={eventModel} />}
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
  );
}

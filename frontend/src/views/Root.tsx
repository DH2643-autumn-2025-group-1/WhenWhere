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
import { HomepagePresenter } from "../presenters/HomepagePresenter.tsx";
import { EventPresenter } from "../presenters/EventPresenter.tsx";
import { theme } from "../styles/theme.ts";
import { HeaderPresenter } from "../presenters/HeaderPresenter.tsx";
import { ProtectedRoute } from "../components/utils/ProtectedRoute.tsx";
import type { EventModelType } from "../models/EventModel";

const muiTheme = createTheme({});

export function Root({ model }: { model: EventModelType }) {
  return (
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
          <Route path="/events" element={<ProtectedRoute><div>My Events Page</div></ProtectedRoute>} />
          <Route
            path="/availability"
            element={
            <ProtectedRoute><AvailabilityPresenter model={model} /></ProtectedRoute>}
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
  );
}

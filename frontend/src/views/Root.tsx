import { Route, Routes } from "react-router";
import { HomepagePresenter } from "../presenters/HomepagePresenter.tsx";
import { ScheduleEventPresenter } from "../presenters/ScheduleEventPresenter.tsx";
import { HeaderPresenter } from "../presenters/HeaderPresenter.tsx";
import { ProtectedRoute } from "../components/utils/ProtectedRoute.tsx";
import { EventResultPresenter } from "../presenters/EventResultPresenter.tsx";
import type { EventModelType } from "../models/EventModel";
import { VoteTimeAndPlacePresenter } from "../presenters/VoteTimeAndPlacePresenter.tsx";
import { LoginPresenter } from "../presenters/LoginPresenter.tsx";
import { SnackbarProvider } from "../contexts/SnackbarContext.tsx";
import { AboutPresenter } from "../presenters/AboutPresenter.tsx";

export function Root({ model }: { model: EventModelType }) {
  return (
    <>
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
          <Route path="/sign-in" element={<LoginPresenter />} />
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
          <Route path="/about" element={<AboutPresenter />} />
        </Routes>
      </SnackbarProvider>
    </>
  );
}

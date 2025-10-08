// Root.tsx
import { Route, Routes } from "react-router";
import App from "./App.tsx";
import { Login } from "./Login.tsx";
import { eventModel } from "../models/EventModel.ts";
import { HomepagePresenter } from "../presenters/HomepagePresenter.tsx";
import { EventPresenter } from "../presenters/EventPresenter.tsx";
import { HeaderPresenter } from "../presenters/Header.tsx";

export function Root() {
  return (
    <>
      <HeaderPresenter />
      <Routes>
        <Route path="/" element={<HomepagePresenter model={eventModel} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mark-availibility" element={<App />} />
        <Route path="/event-result" element={<div>event result</div>} />
        <Route
          path="/create-event"
          element={<EventPresenter model={eventModel} />}
        />
      </Routes>
    </>
  );
}

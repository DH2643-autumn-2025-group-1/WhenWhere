import type { EventModelType } from "../models/EventModel";
import { HomePage } from "../views/Homepage";

export function HomepagePresenter({ model }: { model: EventModelType }) {
  function deleteEvent(id: string) {
    model.deleteEvent(id);
  }

  return (
    <HomePage
      deleteEvent={deleteEvent}
      friendsEvents={model.friendsEvents}
      myEvents={model.myEvents}
    />
  );
}

import type { Event, EventModelType } from "../models/EventModel";
import { HomePage } from "../views/Homepage";
import { observer } from "mobx-react-lite";

export const HomepagePresenter = observer(
  ({ model }: { model: EventModelType }) => {
    function deleteEvent(id: string) {
      model.deleteEvent(id);
    }

    return (
      <HomePage
        deleteEvent={deleteEvent}
        friendsEvents={model.friendsEvents}
        myEvents={model.myEvents}
        onSelectEvent={(event: Event) => {
          model.currentEvent = event;
        }}
      />
    );
  },
);

import { useEffect, useState } from "react";
import type { EventModelType, Event } from "../models/EventModel";
import { HomePage } from "../views/Homepage";
import { observer } from "mobx-react-lite";
import { LoadingView } from "../components/utils/Loading";

export const HomepagePresenter = observer(
  ({ model }: { model: EventModelType }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function loadEvents() {
        if (model.getUserId()) {
          try {
            await Promise.all([
              model.fetchMyEvents(),
              model.fetchFriendsEvents(),
            ]);
          } catch (error) {
            console.error("Failed to load events:", error);
          } finally {
            setLoading(false);
          }
        } else {
          
          setLoading(false);
        }
      }

      loadEvents();
    }, [model, model.getUserId()]);

    function deleteEvent(id: string) {
      model.deleteEvent(id);
    }

    if (loading) {
      
      return <LoadingView />;
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

import { useEffect, useState } from "react";
import type { EventModelType, Event } from "../models/EventModel";
import { HomePage } from "../views/Homepage";
import { observer } from "mobx-react-lite";
import { LoadingView } from "../components/utils/Loading";
import { useNavigate } from "react-router";
import { makeAvailabilityPath } from "../utils/shareHash";
import { useSnackbar } from "../contexts/useSnackbar";

export const HomepagePresenter = observer(
  ({ model }: { model: EventModelType }) => {
    const [loading, setLoading] = useState(true);
    const userId = model.getUserId();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
      async function loadEvents() {
        if (userId) {
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
    }, [model, userId]);

    async function deleteEvent(id: string) {
      try {
        await model.deleteEvent(id);
        showSnackbar("Event removed successfully", "success");
      } catch (error) {
        showSnackbar(
          error instanceof Error ? error.message : String(error),
          "error",
        );
      }
    }

    function onCreateEvent() {
      navigate("create-event");
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
          model.updateCurrentEvent(event);
          navigate(makeAvailabilityPath(event.shareHash));
        }}
        onCreateEvent={onCreateEvent}
      />
    );
  },
);

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import type { EventModelType, Place } from "../models/EventModel";
import VoteTimeAndPlace from "../views/VoteTimeAndPlace";
import { saveAvailabilityOnDB } from "../services/backendCommunication";
import { getShareHashFromSearch, makeResultPath } from "../utils/shareHash";
import { LoadingView } from "../components/utils/Loading";
import { observer } from "mobx-react-lite";

export const VoteTimeAndPlacePresenter = observer(
  ({ model }: { model: EventModelType }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const shareHash = getShareHashFromSearch(location.search);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [votedLocation, setVotedLocation] = useState<Place | null>(null);

    useEffect(() => {
      if (!shareHash) return;
      if (model.currentEvent?.shareHash === shareHash) {
        if (model.hasUserVoted()) {
          navigate(makeResultPath(shareHash), { replace: true });
        }
        return;
      }

      setIsLoading(true);
      model
        .fetchEventByHash(shareHash)
        .then(() => {
          if (model.hasUserVoted()) {
            navigate(makeResultPath(shareHash), { replace: true });
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }, [model, shareHash, navigate]);

    const resultsPath = shareHash ? makeResultPath(shareHash) : "/event-result";

    if (isLoading) {
      return <LoadingView />;
    }

    const handleSubmit = async () => {
      const eventId = model.currentEvent?._id;
      const userId = model.userId;
      if (!eventId || !userId) {
        navigate(resultsPath);
        return;
      }
      try {
        const updatedEvent = await saveAvailabilityOnDB(
          eventId,
          userId,
          selectedDates,
          votedLocation,
        );
        model.currentEvent = updatedEvent;
      } finally {
        navigate(resultsPath);
      }
    };

    return (
      <VoteTimeAndPlace
        places={model.currentEvent?.places}
        resultsPath={resultsPath}
        onSelectedDatesChange={setSelectedDates}
        onLocationVote={setVotedLocation}
        onSubmit={handleSubmit}
        shareUrl={shareHash ? window.location.href : ""}
      />
    );
  },
);

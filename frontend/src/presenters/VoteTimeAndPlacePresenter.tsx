import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import type { EventModelType } from "../models/EventModel";
import VoteTimeAndPlace from "../views/VoteTimeAndPlace";
import { saveAvailabilityOnDB } from "../services/backendCommunication";
import {
  getShareHashFromSearch,
  makeResultPath,
  makeAbsolute,
  makeAvailabilityPath,
} from "../utils/shareHash";
import { LoadingView } from "../components/utils/Loading";

export function VoteTimeAndPlacePresenter({
  model,
}: {
  model: EventModelType;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const shareHash = getShareHashFromSearch(location.search);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

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
  const shareUrl = shareHash
    ? makeAbsolute(makeAvailabilityPath(shareHash))
    : undefined;

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
      );
      model.currentEvent = updatedEvent;
    } finally {
      navigate(resultsPath);
    }
  };

  return (
    <VoteTimeAndPlace
      model={model}
      places={model.currentEvent?.places}
      resultsPath={resultsPath}
      shareUrl={shareUrl}
      onSelectedDatesChange={setSelectedDates}
      onSubmit={handleSubmit}
    />
  );
}

import type { EventModelType } from "../models/EventModel";
import VoteTimeAndPlace from "../views/VoteTimeAndPlace";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
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

  useEffect(() => {
    if (!shareHash) return;
    if (model.currentEvent?.shareHash === shareHash) {
      // Check if user has already voted
      if (model.hasUserVoted()) {
        navigate(makeResultPath(shareHash), { replace: true });
      }
      return;
    }

    setIsLoading(true);
    model
      .fetchEventByHash(shareHash)
      .then(() => {
        // After fetching, check if user has already voted
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

  return (
    <VoteTimeAndPlace
      model={model}
      places={model.currentEvent?.places}
      resultsPath={resultsPath}
      shareUrl={shareUrl}
    />
  );
}

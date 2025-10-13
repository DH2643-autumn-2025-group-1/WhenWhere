import type { EventModelType } from "../models/EventModel";
import VoteTimeAndPlace from "../views/VoteTimeAndPlace";
import { useEffect } from "react";
import { useLocation } from "react-router";
import { getShareHashFromSearch, makeResultPath } from "../utils/shareHash";

export function VoteTimeAndPlacePresenter({
  model,
}: {
  model: EventModelType;
}) {
  const location = useLocation();
  const shareHash = getShareHashFromSearch(location.search);

  useEffect(() => {
    if (!shareHash) return;
    if (model.currentEvent?.shareHash === shareHash) return;
    model.fetchEventByHash(shareHash).catch(console.error);
  }, [model, shareHash]);

  const resultsPath = shareHash ? makeResultPath(shareHash) : "/event-result";
  return (
    <VoteTimeAndPlace
      model={model}
      places={model.currentEvent?.places}
      resultsPath={resultsPath}
    />
  );
}

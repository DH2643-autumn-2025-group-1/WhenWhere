import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import type { EventModelType } from "../models/EventModel";
import {
  getShareHashFromSearch,
  makeAbsolute,
  makeAvailabilityPath,
} from "../utils/shareHash";
import { EventResultView } from "../views/EventResult";
import { LoadingView } from "../components/utils/Loading";

export function EventResultPresenter({ model }: { model: EventModelType }) {
  const location = useLocation();
  const shareHash = getShareHashFromSearch(location.search);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!shareHash) return;
    if (model.currentEvent?.shareHash === shareHash) return;

    setIsLoading(true);
    model
      .fetchEventByHash(shareHash)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [model, shareHash]);

  const shareUrl = shareHash
    ? makeAbsolute(makeAvailabilityPath(shareHash))
    : undefined;

  if (isLoading) {
    return <LoadingView />;
  }

  return (
    <EventResultView
      eventTitle={model.currentEvent?.title ?? ""}
      shareUrl={shareUrl}
    />
  );
}

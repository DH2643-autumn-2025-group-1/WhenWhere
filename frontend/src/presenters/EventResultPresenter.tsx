import { useEffect } from "react";
import { useLocation } from "react-router";
import type { EventModelType } from "../models/EventModel";
import {
  getShareHashFromSearch,
  makeAbsolute,
  makeAvailabilityPath,
} from "../utils/shareHash";
import { EventResultView } from "../views/EventResult";

export function EventResultPresenter({ model }: { model: EventModelType }) {
  const location = useLocation();
  const shareHash = getShareHashFromSearch(location.search);

  useEffect(() => {
    if (!shareHash) return;
    if (model.currentEvent?.shareHash === shareHash) return;
    model.fetchEventByHash(shareHash).catch(console.error);
  }, [model, shareHash]);

  if (!model.currentEvent) return null;

  const share = model.currentEvent.shareHash;
  const shareUrl = share
    ? makeAbsolute(makeAvailabilityPath(share))
    : undefined;
  return (
    <EventResultView
      eventTitle={model.currentEvent.title}
      shareUrl={shareUrl}
    />
  );
}

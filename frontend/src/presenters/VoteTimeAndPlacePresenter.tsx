import type { EventModelType } from "../models/EventModel";
import VoteTimeAndPlace from "../views/VoteTimeAndPlace";

export function VoteTimeAndPlacePresenter({
  model,
}: {
  model: EventModelType;
}) {
  return <VoteTimeAndPlace places={model.currentEvent?.places} />;
}

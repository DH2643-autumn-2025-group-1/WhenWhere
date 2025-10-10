import type { EventPlace } from "../models/EventModel";
import { VoteLocation } from "../views/VoteLocation";

export function VoteLocationPresenter({
  places,
  setHaveVotedLocation,
}: {
  places?: EventPlace[];
  setHaveVotedLocation: (voted: boolean) => void;
}) {
  return (
    <VoteLocation
      setHaveVotedLocation={setHaveVotedLocation}
      places={places}
      isvoting={true}
    />
  );
}

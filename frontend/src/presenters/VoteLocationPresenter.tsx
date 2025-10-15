import { VoteLocation } from "../views/VoteLocation";
import type { Place } from "../models/EventModel";

export function VoteLocationPresenter({
  setHaveVotedLocation,
  places,
  onLocationChange,
}: {
  setHaveVotedLocation: (voted: boolean) => void;
  places: Place[];
  onLocationChange?: (place: Place | null) => void;
}) {
  return (
    <VoteLocation
      places={places}
      setHaveVotedLocation={setHaveVotedLocation}
      onLocationChange={onLocationChange}
    />
  );
}

import { VoteLocation } from "../views/VoteLocation";

export function VoteLocationPresenter({
  places,
  setHaveVotedLocation,
  onLocationChange,
}: {
  places?: string[];
  setHaveVotedLocation: (voted: boolean) => void;
  onLocationChange?: (location: string | null) => void;
}) {
  return (
    <VoteLocation
      setHaveVotedLocation={setHaveVotedLocation}
      places={places}
      onLocationChange={onLocationChange}
    />
  );
}

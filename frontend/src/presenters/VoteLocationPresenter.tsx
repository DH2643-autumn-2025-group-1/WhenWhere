import { VoteLocation } from "../views/VoteLocation";

export function VoteLocationPresenter({
  setHaveVotedLocation,
  places,
  onLocationChange,
}: {
  setHaveVotedLocation: (voted: boolean) => void;
  places: any[];
  onLocationChange?: (place: any) => void; 
}) {
  return (
    <VoteLocation
      places={places}
      setHaveVotedLocation={setHaveVotedLocation}
      onLocationChange={onLocationChange}  
    />
  );
}

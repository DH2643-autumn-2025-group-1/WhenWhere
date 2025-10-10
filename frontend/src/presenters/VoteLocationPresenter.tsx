import { VoteLocation } from "../views/VoteLocation";

export function VoteLocationPresenter({
  places,
  setHaveVotedLocation,
}: {
  places?: string[];
  setHaveVotedLocation: (voted: boolean) => void;
}) {
  return (
    <VoteLocation setHaveVotedLocation={setHaveVotedLocation} places={places} />
  );
}

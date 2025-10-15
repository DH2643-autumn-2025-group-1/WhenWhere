import { observer } from "mobx-react-lite";
import type { EventLocation } from "../models/EventModel";
import { VoteLocation } from "../views/VoteLocation";

export const VoteLocationPresenter = observer(
  ({
    places,
    setHaveVotedLocation,
    onLocationChange,
  }: {
    places?: EventLocation[];
    setHaveVotedLocation: (voted: boolean) => void;
    onLocationChange?: (location: string | null) => void;
  }) => {
    return (
      <VoteLocation
        setHaveVotedLocation={setHaveVotedLocation}
        places={places}
        isvoting={true}
        onLocationChange={onLocationChange}
      />
    );
  },
);

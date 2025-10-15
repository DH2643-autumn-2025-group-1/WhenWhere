import { observer } from "mobx-react-lite";
import { VoteLocation } from "../views/VoteLocation";
import type { Place } from "../models/EventModel";

export const VoteLocationPresenter = observer(
  ({
    places,
    setHaveVotedLocation,
    onLocationChange,
  }: {
    places?: Place[];
    setHaveVotedLocation: (voted: boolean) => void;
    onLocationChange?: (location: Place | null) => void;
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

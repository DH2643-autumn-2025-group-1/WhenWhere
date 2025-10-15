import type { EventModelType } from "../models/EventModel";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import {
  getShareHashFromSearch,
  makeAbsolute,
  makeAvailabilityPath,
} from "../utils/shareHash";
import { EventResult } from "../views/EventResult";
import { LoadingView } from "../components/utils/Loading";
import { observer } from "mobx-react-lite";

export const EventResultPresenter = observer(
  ({ model }: { model: EventModelType }) => {
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

    function getMostVotedLocation() {
      if (
        !model.currentEvent?.places ||
        model.currentEvent.places.length === 0
      ) {
        return null;
      }

      const mostVotedPlace = model.currentEvent.places.reduce(
        (topPlace, currentPlace) => {
          return currentPlace.votes.length > topPlace.votes.length
            ? currentPlace
            : topPlace;
        },
      );

      return mostVotedPlace.place;
    }
    function getWinningSlots() {
      const slotVoteCount: { [key: string]: number } = {};
      const slotPeople: { [key: string]: string[] } = {};

      model.currentEvent?.availability.forEach((availability) => {
        availability.availableSlots.forEach((slot) => {
          const slotKey = slot.toString();
          slotVoteCount[slotKey] = (slotVoteCount[slotKey] || 0) + 1;

          if (!slotPeople[slotKey]) {
            slotPeople[slotKey] = [];
          }
          slotPeople[slotKey].push(availability.userId);
        });
      });

      const sortedSlots = Object.entries(slotVoteCount)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 3)
        .map(([slotKey]) => ({
          slot: new Date(slotKey).toLocaleString(),
          people: slotPeople[slotKey],
        }));

      return sortedSlots;
    }

    const topLocation = getMostVotedLocation();
    const winningSlots = getWinningSlots();

    return (
      <EventResult
        eventTitle={model.currentEvent?.title ?? ""}
        shareUrl={shareUrl}
        winningSlots={winningSlots}
        topLocation={topLocation}
        places={model.currentEvent?.places || []}
      />
    );
  },
);

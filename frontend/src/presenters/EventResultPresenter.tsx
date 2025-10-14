import type { EventModelType } from "../models/EventModel";
import { EventResult } from "../views/EventResult";

export function EventResultPresenter({ model }: { model: EventModelType }) {
  function getMostVotedLocation() {
    if (!model.currentEvent?.places || model.currentEvent.places.length === 0) {
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
      winningSlots={winningSlots}
      topLocation={topLocation}
      places={model.currentEvent?.places || []}
    />
  );
}

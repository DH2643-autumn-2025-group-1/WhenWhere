import type { EventModelType } from "../models/EventModel";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import {
  getShareHashFromSearch,
  makeAbsolute,
  makeAvailabilityPath,
} from "../utils/shareHash";
import { EventResult } from "../views/EventResult";
import { LoadingView } from "../components/utils/Loading";
import { observer } from "mobx-react-lite";
import { isBefore, isSameDay, startOfDay, startOfWeek } from "date-fns";
import { enGB } from "date-fns/locale";
import { NotFound } from "../components/utils/NotFound";

export const EventResultPresenter = observer(
  ({ model }: { model: EventModelType }) => {
    const location = useLocation();
    const shareHash = getShareHashFromSearch(location.search);
    const [isLoading, setIsLoading] = useState(false);
    const [weekAnchor, setWeekAnchor] = useState(() => new Date());

    useEffect(() => {
      if (!shareHash) return;
      if (model.currentEvent?.shareHash === shareHash) return;

      setIsLoading(true);
      model
        .fetchEventByHash(shareHash)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }, [model, shareHash]);

    const allowedDays = useMemo(() => {
      const opts = model.currentEvent?.dateOptions || [];
      return opts.map((d) => startOfDay(new Date(d)));
    }, [model.currentEvent?.dateOptions]);

    const minWeekStart = useMemo(() => {
      if (!allowedDays.length) return undefined;
      const min = allowedDays.reduce((a, b) => (a < b ? a : b), allowedDays[0]);
      return startOfWeek(min, { weekStartsOn: 1, locale: enGB });
    }, [allowedDays]);

    const maxWeekStart = useMemo(() => {
      if (!allowedDays.length) return undefined;
      const max = allowedDays.reduce((a, b) => (a > b ? a : b), allowedDays[0]);
      return startOfWeek(max, { weekStartsOn: 1, locale: enGB });
    }, [allowedDays]);

    useEffect(() => {
      if (!allowedDays.length) return;
      const now = startOfDay(new Date());
      const sorted = [...allowedDays].sort((a, b) => a.getTime() - b.getTime());
      const firstFuture = sorted.find((d) => d >= now) ?? sorted[0];
      const targetWeek = startOfWeek(firstFuture, {
        weekStartsOn: 1,
        locale: enGB,
      });
      setWeekAnchor(targetWeek);
    }, [allowedDays]);

    const shareUrl = shareHash
      ? makeAbsolute(makeAvailabilityPath(shareHash))
      : undefined;

    if (!shareHash) {
      return (
        <NotFound message="Error: No event was found. The link is missing its hash." />
      );
    }

    if (isLoading) {
      return <LoadingView />;
    }

    if (!model.currentEvent) {
      return <NotFound message="Error: No event was found for this link." />;
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

      return mostVotedPlace;
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
          slotPeople[slotKey].push(availability.username || "Anonymous");
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

    const isDayAllowed = (day: Date) => {
      const now = new Date();
      const todayStart = startOfDay(now);
      if (isBefore(day, todayStart)) {
        return false;
      }
      return allowedDays.some((d) => isSameDay(d, day));
    };

    return (
      <EventResult
        eventTitle={model.currentEvent?.title ?? ""}
        shareUrl={shareUrl}
        winningSlots={winningSlots}
        topLocation={topLocation}
        places={model.currentEvent?.places || []}
        userId={model.userId}
        event={model.currentEvent}
        weekAnchor={weekAnchor}
        isDayAllowed={isDayAllowed}
        onNavigateWeek={setWeekAnchor}
        minWeekStart={minWeekStart}
        maxWeekStart={maxWeekStart}
      />
    );
  },
);

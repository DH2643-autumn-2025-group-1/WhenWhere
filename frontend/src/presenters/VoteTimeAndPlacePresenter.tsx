import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import type { EventModelType, Place } from "../models/EventModel";
import VoteTimeAndPlace from "../views/VoteTimeAndPlace";
import { saveAvailabilityOnDB } from "../services/backendCommunication";
import { getShareHashFromSearch, makeResultPath } from "../utils/shareHash";
import { LoadingView } from "../components/utils/Loading";
import { observer } from "mobx-react-lite";
import { AvailabilityPresenter } from "./AvailabilityPresenter";
import { VoteLocationPresenter } from "./VoteLocationPresenter";
import { runInAction } from "mobx";

export const VoteTimeAndPlacePresenter = observer(
  ({ model }: { model: EventModelType }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const shareHash = getShareHashFromSearch(location.search);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [votedLocation, setVotedLocation] = useState<Place | null>(null);
    const [haveVotedTime, setHaveVotedTime] = useState(false);
    const [haveVotedLocation, setHaveVotedLocation] = useState(false);
    const resultsPath = shareHash ? makeResultPath(shareHash) : "/event-result";
    const places = useMemo(
      () => model.currentEvent?.places || [],
      [model.currentEvent?.places],
    );

    useEffect(() => {
      if (!shareHash) return;
      if (model.currentEvent?.shareHash === shareHash) {
        if (model.hasUserVoted()) {
          navigate(makeResultPath(shareHash), { replace: true });
        }
        return;
      }

      setIsLoading(true);
      model
        .fetchEventByHash(shareHash)
        .then(() => {
          if (model.hasUserVoted()) {
            navigate(makeResultPath(shareHash), { replace: true });
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }, [model, shareHash, navigate]);

    useEffect(() => {
      if (!places || places.length === 0) {
        setHaveVotedLocation(true);
      } else if (places.length === 1) {
        setVotedLocation(places[0]);
        setHaveVotedLocation(true);
      }
    }, [setHaveVotedLocation, places]);

    const handleSubmit = async () => {
      const eventId = model.currentEvent?._id;
      const userId = model.userId;
      const username = model.username ?? undefined;

      if (!eventId || !userId) {
        navigate(resultsPath);
        return;
      }

      const newVotedLocation =
        places.length > 0 && votedLocation
          ? {
              ...votedLocation,
              votes: [...new Set([...(votedLocation.votes ?? []), userId])],
            }
          : null;

      try {
        const updatedEvent = await saveAvailabilityOnDB(
          eventId,
          userId,
          username,
          selectedDates,
          newVotedLocation,
        );
        runInAction(() => {
          model.currentEvent = updatedEvent;
        });
      } finally {
        navigate(resultsPath);
      }
    };
    if (isLoading) {
      return <LoadingView />;
    }

    return (
      <VoteTimeAndPlace
        eventTitle={model.currentEvent?.title ?? ""}
        eventDescription={model.currentEvent?.description}
        availabilitySlot={
          <AvailabilityPresenter
            setHaveVotedTime={setHaveVotedTime}
            onSelectedChange={setSelectedDates}
            model={model}
          />
        }
        locationSlot={
          <VoteLocationPresenter
            setHaveVotedLocation={setHaveVotedLocation}
            places={places}
            onLocationChange={setVotedLocation}
          />
        }
        resultsPath={resultsPath}
        onSubmit={handleSubmit}
        submitDisabled={!haveVotedTime || !haveVotedLocation}
        shareUrl={shareHash ? window.location.href : undefined}
      />
    );
  },
);

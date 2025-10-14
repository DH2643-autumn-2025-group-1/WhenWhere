import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import type { EventModelType } from "../models/EventModel";
import VoteTimeAndPlace from "../views/VoteTimeAndPlace";
import { saveAvailabilityOnDB } from "../services/backendCommunication";

export function VoteTimeAndPlacePresenter({
  model,
}: {
  model: EventModelType;
}) {
  const [haveVotedLocation, setHaveVotedLocation] = useState(false);
  const [haveVotedTime, setHaveVotedTime] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmitAndSave = useCallback(async () => {
    const eventId = model.currentEvent?._id;
    const userId = model.userId;
    if (!eventId || !userId) {
      navigate("/event-result");
      return;
    }
    if (selectedDates.length === 0) return;
    try {
      setIsSaving(true);
      setError(null);
      await saveAvailabilityOnDB(eventId, userId, selectedDates);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save availability");
    } finally {
      setIsSaving(false);
      navigate("/event-result");
    }
  }, [model, selectedDates, navigate]);

  return (
    <VoteTimeAndPlace
      places={model.currentEvent?.places}
      haveVotedLocation={haveVotedLocation}
      setHaveVotedLocation={setHaveVotedLocation}
      haveVotedTime={haveVotedTime}
      setHaveVotedTime={setHaveVotedTime}
      onSelectedDatesChange={setSelectedDates}
      isSaving={isSaving}
      error={error}
      onSubmit={handleSubmitAndSave}
    />
  );
}

import { useState } from "react";
import { Dayjs } from "dayjs";
import { type EventData, type EventModelType } from "../models/EventModel";
import { ScheduleEvent } from "../views/ScheduleEvent";
import { observer } from "mobx-react-lite";
import { makeAvailabilityPath } from "../utils/shareHash";
import { useNavigate } from "react-router";
import type { Place } from "../models/EventModel";
import { useSnackbar } from "../contexts/useSnackbar";
import { LoadingView } from "../components/utils/Loading";
import { LocationPresenter } from "./LocationPresenter";
import { APIProvider } from "@vis.gl/react-google-maps";

const API_KEY = import.meta.env.VITE_REACT_GOOGLE_PLACES_API_KEY;

export interface ScheduleEventProps {
  places: Place[];
  selectedDates: Dayjs[];
  title: string;
  description: string;
  isSubmitting: boolean;
  onAddPlace: () => void;
  onPlaceChange: (index: number, value: Place) => void;
  onRemovePlace: (index: number) => void;
  onDateClick: (date: Dayjs | null) => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
  setShouldIncludeDigital: (value: boolean) => void;
  renderPlaceInput: (
    value: Place,
    label: string,
    onSelect: (value: Place | null) => void,
  ) => JSX.Element;
}

export const ScheduleEventPresenter = observer(
  ({ model }: { model: EventModelType }) => {
    if (!model) {
      console.error("Model prop is undefined");
      return null;
    }
    const [places, setPlaces] = useState<Place[]>([]);
    const [selectedDates, setSelectedDates] = useState<Dayjs[]>([]);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [shouldIncludeDigital, setShouldIncludeDigital] = useState(false);
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const handleAddPlace = () => {
      setPlaces([...places, { name: "", votes: [] }]);
    };

    const handlePlaceChange = (index: number, value: Place) => {
      const updatedPlaces = [...places];
      updatedPlaces[index] = value;
      setPlaces(updatedPlaces);
      model.addPlace(value);
    };

    const handleRemovePlace = (index: number) => {
      const updatedPlaces = places.filter((_, i) => i !== index);
      setPlaces(updatedPlaces);
    };

    const handleDateClick = (date: Dayjs | null) => {
      if (!date) return;
      const isSelected = selectedDates.some((d) => d.isSame(date, "day"));

      if (isSelected) {
        setSelectedDates(selectedDates.filter((d) => !d.isSame(date, "day")));
      } else {
        setSelectedDates([...selectedDates, date]);
      }
    };

    const handleTitleChange = (value: string) => {
      setTitle(value);
    };

    const handleDescriptionChange = (value: string) => {
      setDescription(value);
    };

    const createEvent = async (eventData: EventData): Promise<void> => {
      try {
        if (!eventData.title.trim()) {
          showSnackbar("Title is required", "error");
          return;
        }

        if (eventData.dateOptions.length === 0) {
          showSnackbar("At least one date must be selected", "error");
          return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const validPlaces = eventData.places.filter(
          (place) =>
            place && typeof place === "object" && Object.keys(place).length > 0,
        );

        const finalEventData: EventData = {
          ...eventData,
          title: eventData.title.trim(),
          description: eventData.description?.trim() || undefined,
          places: validPlaces,
        };
        const created = await model.createEvent(finalEventData);

        setTitle("");
        setDescription("");
        setPlaces([]);
        setSelectedDates([]);

        const votingPath = makeAvailabilityPath(created.shareHash);
        navigate(votingPath);

        showSnackbar("Event created successfully!", "success");
      } catch (error) {
        showSnackbar(
          error instanceof Error ? error.message : String(error),
          "error",
        );
      }
    };

    const handleSubmit = async () => {
      setIsSubmitting(true);

      const creatorId = model.getUserId();

      if (!creatorId) {
        showSnackbar("You must be signed in to create an event.", "error");
        setIsSubmitting(false);
        return;
      }

      if (shouldIncludeDigital) places.push({ name: "digital", votes: [] });

      const eventData: EventData = {
        title,
        description,
        places,
        dateOptions: selectedDates.map((date) => date.toDate()),
        creatorId,
      };

      try {
        await createEvent(eventData);
      } finally {
        setIsSubmitting(false);
      }
    };

    const viewProps: ScheduleEventProps = {
      places,
      selectedDates,
      title,
      description,
      isSubmitting,
      onAddPlace: handleAddPlace,
      onPlaceChange: handlePlaceChange,
      onRemovePlace: handleRemovePlace,
      onDateClick: handleDateClick,
      onTitleChange: handleTitleChange,
      onDescriptionChange: handleDescriptionChange,
      onSubmit: handleSubmit,
      setShouldIncludeDigital: setShouldIncludeDigital,
      renderPlaceInput: (value, label, onSelect) => (
        <LocationPresenter
          value={value}
          label={label}
          onSelectFuntion={onSelect}
        />
      ),
    };

    if (isSubmitting) {
      return <LoadingView />;
    }
    return (
      <APIProvider apiKey={API_KEY} libraries={["places"]}>
        <ScheduleEvent {...viewProps} />
      </APIProvider>
    );
  },
);

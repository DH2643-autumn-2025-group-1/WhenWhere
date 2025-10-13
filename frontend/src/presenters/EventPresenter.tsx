import { useState } from "react";
import { Dayjs } from "dayjs";
import { type EventData, type EventModelType } from "../models/EventModel";
import { ScheduleEventView } from "../views/ScheduleEventView";
import { observer } from "mobx-react-lite";
import { makeAvailabilityPath } from "../utils/shareHash";
import { useNavigate } from "react-router";

export interface ScheduleEventViewProps {
  places: string[];
  selectedDates: Dayjs[];
  title: string;
  description: string;
  isSubmitting: boolean;
  snackbar: {
    open: boolean;
    message: string;
    severity: "success" | "error";
  };
  onAddPlace: () => void;
  onPlaceChange: (index: number, value: string) => void;
  onRemovePlace: (index: number) => void;
  onDateClick: (date: Dayjs | null) => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
  onCloseSnackbar: () => void;
}

export const EventPresenter = observer(
  ({ model }: { model: EventModelType }) => {
    if (!model) {
      console.error("Model prop is undefined");
      return null;
    }
    const [places, setPlaces] = useState<string[]>([]);
    const [selectedDates, setSelectedDates] = useState<Dayjs[]>([]);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<{
      open: boolean;
      message: string;
      severity: "success" | "error";
    }>({ open: false, message: "", severity: "success" });
    const navigate = useNavigate();

    const handleAddPlace = () => {
      setPlaces([...places, ""]);
    };

    const handlePlaceChange = (index: number, value: string) => {
      const updatedPlaces = [...places];
      updatedPlaces[index] = value;
      setPlaces(updatedPlaces);
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
          throw new Error("Event title is required");
        }

        if (eventData.dateOptions.length === 0) {
          throw new Error("At least one date must be selected");
        }

        const validPlaces = eventData.places.filter(
          (place: string) => place.trim() !== "",
        );

        const finalEventData: EventData = {
          ...eventData,
          title: eventData.title.trim(),
          description: eventData.description?.trim() || undefined,
          places: validPlaces,
        };
        const created = await model.createEvent(finalEventData);

        // Navigate user to the voting page after successful creation, this will however omit the snackbar alert which is why we might want a global snackbar in root if possible.
        const votingPath = makeAvailabilityPath(created.shareHash);
        navigate(votingPath);

        setSnackbar({
          open: true,
          message: "Event created successfully!",
          severity: "success",
        });

        // Reset form
        setTitle("");
        setDescription("");
        setPlaces([]);
        setSelectedDates([]);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";

        setSnackbar({ open: true, message: errorMessage, severity: "error" });
      }
    };

    const handleSubmit = async () => {
      setIsSubmitting(true);

      const creatorId = model.getUserId();

      if (!creatorId) {
        setSnackbar({
          open: true,
          message: "You must be signed in to create an event.",
          severity: "error",
        });
        setIsSubmitting(false);
        return;
      }

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

    const handleCloseSnackbar = () => {
      setSnackbar({ ...snackbar, open: false });
    };

    const viewProps: ScheduleEventViewProps = {
      places,
      selectedDates,
      title,
      description,
      isSubmitting,
      snackbar,
      onAddPlace: handleAddPlace,
      onPlaceChange: handlePlaceChange,
      onRemovePlace: handleRemovePlace,
      onDateClick: handleDateClick,
      onTitleChange: handleTitleChange,
      onDescriptionChange: handleDescriptionChange,
      onSubmit: handleSubmit,
      onCloseSnackbar: handleCloseSnackbar,
    };

    return <ScheduleEventView {...viewProps} />;
  },
);

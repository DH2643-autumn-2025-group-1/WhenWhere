import { useState } from "react";
import { Dayjs } from "dayjs";
import { EventModel, type EventData } from "../models/EventModel";
import { ScheduleEventView } from "../views/ScheduleEventView";

export interface EventFormData {
  title: string;
  description: string;
  places: string[];
  selectedDates: Date[];
}

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

export function EventPresenter() {
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

  const createEvent = async (
    formData: EventFormData,
    creatorId: string,
  ): Promise<void> => {
    try {
      if (!formData.title.trim()) {
        throw new Error("Event title is required");
      }

      if (formData.selectedDates.length === 0) {
        throw new Error("At least one date must be selected");
      }

      const validPlaces = formData.places.filter(
        (place) => place.trim() !== "",
      );

      const eventData: EventData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        places: validPlaces,
        dateOptions: formData.selectedDates,
        creatorId: creatorId,
      };

      await EventModel.createEvent(eventData);

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
        error instanceof Error ? error.message : "An unexpected error occurred";

      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const formData: EventFormData = {
      title,
      description,
      places,
      selectedDates: selectedDates.map((date) => date.toDate()),
    };

    // Placeholder
    const creatorId = "user123";

    await createEvent(formData, creatorId);
    setIsSubmitting(false);
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
}

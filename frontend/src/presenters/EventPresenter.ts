import {
  EventModel,
  type EventData,
  type EventResponse,
} from "../models/EventModel";

export interface EventFormData {
  title: string;
  description: string;
  places: string[];
  selectedDates: Date[];
}

export class EventPresenter {
  private model: EventModel;
  private onEventCreated?: (event: EventResponse) => void;
  private onEventDeleted?: (eventId: string) => void;
  private onError?: (error: string) => void;

  constructor(
    model: EventModel,
    onEventCreated?: (event: EventResponse) => void,
    onError?: (error: string) => void,
    onEventDeleted?: (eventId: string) => void,
  ) {
    this.model = model;
    this.onEventCreated = onEventCreated;
    this.onError = onError;
    this.onEventDeleted = onEventDeleted;
  }

  async createEvent(formData: EventFormData, creatorId: string): Promise<void> {
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

      const createdEvent = await this.model.createEvent(eventData);

      if (this.onEventCreated) {
        this.onEventCreated(createdEvent);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      console.error("Error in EventPresenter.createEvent:", error);

      if (this.onError) {
        this.onError(errorMessage);
      }
    }
  }

  async getAllEvents(): Promise<EventResponse[]> {
    try {
      return await this.model.getAllEvents();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch events";
      console.error("Error in EventPresenter.getAllEvents:", error);

      if (this.onError) {
        this.onError(errorMessage);
      }
      throw error;
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    try {
      if (!eventId) {
        throw new Error("Event ID is required");
      }

      await this.model.deleteEvent(eventId);

      if (this.onEventDeleted) {
        this.onEventDeleted(eventId);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete event";
      console.error("Error in EventPresenter.deleteEvent:", error);

      if (this.onError) {
        this.onError(errorMessage);
      }
    }
  }

  validateFormData(formData: EventFormData): string[] {
    const errors: string[] = [];

    if (!formData.title.trim()) {
      errors.push("Event title is required");
    }

    if (formData.selectedDates.length === 0) {
      errors.push("At least one date must be selected");
    }

    return errors;
  }
}

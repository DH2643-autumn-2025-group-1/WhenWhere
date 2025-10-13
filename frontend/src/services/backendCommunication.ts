import type { EventData } from "../models/EventModel";

export const fetchEvents = async () => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/events`);
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  return response.json();
};

export const createEventOnDB = async (eventData: EventData) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  });
  if (!response.ok) {
    throw new Error("Failed to create event");
  }
  return response.json();
};

export const deleteEventOnDB = async (eventId: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/events/${eventId}`,
    {
      method: "DELETE",
    },
  );
  if (!response.ok) {
    throw new Error("Failed to delete event");
  }
  return;
};

export const fetchCreatedEvents = async (userId: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/events/created/${userId}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch created events");
  }
  return response.json();
};

export const fetchInvitedEvents = async (userId: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/events/invited/${userId}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch invited events");
  }
  return response.json();
};

export const updateEventAvailability = async (
  eventId: string,
  availability: { userId: string; availableSlots: Date[] },
) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/events/${eventId}/availability`,
    {
      method: "PUT",
      body: JSON.stringify(availability),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to update event availability");
  }
  return response.json();
};

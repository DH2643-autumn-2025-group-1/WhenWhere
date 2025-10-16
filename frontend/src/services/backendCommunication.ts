import type { EventData, Place } from "../models/EventModel";

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

export const saveAvailabilityOnDB = async (
  eventId: string,
  userId: string,
  username?: string,
  availableSlots?: Date[],
  votedLocation?: Place | null,
) => {
  const body: {
    userId: string;
    username?: string;
    availableSlots?: Date[];
    votedLocation?: Place | null;
  } = { userId };

  if (username) body.username = username;
  if (availableSlots) body.availableSlots = availableSlots;
  if (votedLocation) body.votedLocation = votedLocation;

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/events/${eventId}/availability`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to update availability or location");
  }

  return response.json();
};

export const fetchEventByHash = async (shareHash: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/events/hash/${shareHash}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch event by hash");
  }
  return response.json();
};

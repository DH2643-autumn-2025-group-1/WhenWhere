import type { EventData, Place } from "../models/EventModel";
import { getAuthHeader } from "../firebase/firebaseAuth";

export const fetchEvents = async () => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/events`, {
    headers: {
      ...(await getAuthHeader()),
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  return response.json();
};

export const createEventOnDB = async (eventData: EventData) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/events`, {
    method: "POST",
    headers: {
      ...(await getAuthHeader()),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  });
  if (!response.ok) {
    const errorDetails = await response.text();
    console.error("Error Details:", errorDetails);
    throw new Error("Failed to create event");
  }
  return response.json();
};

export const deleteEventOnDB = async (eventId: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/events/${eventId}`,
    {
      method: "DELETE",
      headers: {
        ...(await getAuthHeader()),
      },
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
    {
      headers: {
        ...(await getAuthHeader()),
      },
    },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch created events");
  }
  return response.json();
};

export const fetchInvitedEvents = async (userId: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/events/invited/${userId}`,
    {
      headers: {
        ...(await getAuthHeader()),
      },
    },
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
      headers: {
        ...(await getAuthHeader()),
        "Content-Type": "application/json",
      },
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
    {
      headers: {
        ...(await getAuthHeader()),
      },
    },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch event by hash");
  }
  return response.json();
};

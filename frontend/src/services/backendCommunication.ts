export const fetchEvents = async () => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/events`);
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  return response.json();
};

export const createEvent = async (eventData: {
  title: string;
  date: string;
  userId: string;
}) => {
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

export const deleteEvent = async (eventId: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/events/${eventId}`,
    {
      method: "DELETE",
    },
  );
  if (!response.ok) {
    throw new Error("Failed to delete event");
  }
  return response.json();
};

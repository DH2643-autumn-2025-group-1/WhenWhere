export interface EventData {
  title: string;
  description?: string;
  places: string[];
  dateOptions: Date[];
  creatorId: string;
}

export interface EventResponse {
  _id: string;
  title: string;
  description?: string;
  creatorId: string;
  dateOptions: Date[];
  places: string[];
  availability: { userId: string; availableSlots: Date[] }[];
  suggestions: { placeName: string; availableDates: Date[]; votes: number }[];
}

export const EventModel = {
  baseUrl: import.meta.env.VITE_API_BASE_URL,

  async createEvent(
    eventData: EventData,
    baseUrl?: string,
  ): Promise<EventResponse> {
    const apiUrl = baseUrl || this.baseUrl;
    const response = await fetch(`${apiUrl}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create event: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  },
};

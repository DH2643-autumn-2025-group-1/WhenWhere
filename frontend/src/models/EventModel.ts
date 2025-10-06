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

export class EventModel {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || import.meta.env.VITE_API_BASE_URL;
  }

  async createEvent(eventData: EventData): Promise<EventResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/events`, {
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
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  async getAllEvents(): Promise<EventResponse[]> {
    try {
      const response = await fetch(`${this.baseUrl}/events`);

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  }
}

import {
  createEventOnDB,
  deleteEventOnDB,
  fetchCreatedEvents,
  fetchInvitedEvents,
} from "../services/backendCommunication";
import { makeAutoObservable } from "mobx";

export interface EventData {
  title: string;
  description?: string;
  places: string[];
  dateOptions: Date[];
  creatorId: string;
}

export interface Event {
  _id: string;
  title: string;
  description?: string;
  creatorId: string;
  dateOptions: Date[];
  places: string[];
  availability: { userId: string; availableSlots: Date[] }[];
  suggestions: { placeName: string; availableDates: Date[]; votes: number }[];
}

export const eventModel = {
  userId: null as string | null,
  myEvents: [] as Event[],
  friendsEvents: [] as Event[],
  currentEvent: null as Event | null,

  setuserId(id: string | null) {
    this.userId = id;
  },

  getUserId() {
    return this.userId;
  },

  async createEvent(eventData: EventData): Promise<Event> {
    const response = await createEventOnDB(eventData);
    this.myEvents.push(response);
    return response;
  },

  async deleteEvent(eventId: string): Promise<void> {
    const response = await deleteEventOnDB(eventId);
    this.myEvents = this.myEvents.filter(
      (event) => event._id.toString() !== eventId,
    );
    return response;
  },

  async fetchMyEvents() {
    if (!this.userId) {
      throw new Error("User ID is not set");
    }
    const events = await fetchCreatedEvents(this.userId);
    this.myEvents = events;
  },

  async fetchFriendsEvents() {
    if (!this.userId) {
      throw new Error("User ID is not set");
    }
    const events = await fetchInvitedEvents(this.userId);
    this.friendsEvents = events;
  },
};

makeAutoObservable(eventModel);

export type EventModelType = typeof eventModel;

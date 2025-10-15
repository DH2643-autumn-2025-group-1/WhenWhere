import {
  createEventOnDB,
  deleteEventOnDB,
  fetchCreatedEvents,
  fetchInvitedEvents,
  fetchEventByHash,
} from "../services/backendCommunication";
import { makeAutoObservable } from "mobx";

export interface EventLocation {
  place: string;
  votes: string[];
}
export interface EventData {
  title: string;
  description?: string;
  places: Place[];
  dateOptions: Date[];
  creatorId: string;
}

export interface Event {
  _id: string;
  title: string;
  description?: string;
  creatorId: string;
  dateOptions: Date[];
  places: Place[];
  availability: { userId: string; availableSlots: Date[] }[];
  suggestions: { placeName: string; availableDates: Date[]; votes: number }[];
  shareHash: string;
}

export interface Place {
  name: string;
  formatted_address?: string;
  geometry?: {
    location?: {
      lat?: number;
      lng?: number;
    };
  };
  html_attributions?: string[];
  votes: string[];
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
    this.currentEvent = response;
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

  async fetchEventByHash(shareHash: string) {
    const ev = await fetchEventByHash(shareHash);
    this.currentEvent = ev;
    return ev;
  },

  addPlace(place: Place) {
    if (this.currentEvent) {
      this.currentEvent.places.push({ ...place, votes: [] });
    }
  },

  hasUserVoted(): boolean {
    if (!this.currentEvent || !this.userId) return false;

    return this.currentEvent.availability?.some(
      (entry) => entry.userId === this.userId,
    );
  },
};

makeAutoObservable(eventModel);

export type EventModelType = typeof eventModel;

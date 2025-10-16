import mongoose, { Schema, Document } from "mongoose";

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
}

export interface Availability {
  userId: string;
  username?: string;
  availableSlots: Date[];
  votedLocation?: Place;
}

export interface IEvent extends Document {
  title: string;
  description?: string;
  creatorId: string;
  dateOptions: Date[];
  places: Place[];
  availability: Availability[];
  shareHash: string;
  suggestions?: { placeName: string; availableDates: Date[]; votes: number }[];
}

const PlaceSchema = new Schema({
  name: { type: String, required: true },
  formatted_address: { type: String },
  geometry: {
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  html_attributions: [String],
});

const AvailabilitySchema = new Schema({
  userId: { type: String },
  username: { type: String },
  availableSlots: [Date],
  votedLocation: PlaceSchema,
});

const SuggestionSchema = new Schema({
  placeName: { type: String },
  availableDates: [Date],
  votes: { type: Number, default: 0 },
});

const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  creatorId: { type: String, required: true },
  dateOptions: [{ type: Date, required: true }],
  places: [PlaceSchema],
  availability: [AvailabilitySchema],
  suggestions: [SuggestionSchema],
  shareHash: { type: String, required: true, unique: true, index: true },
});

export default mongoose.model<IEvent>("Event", EventSchema);

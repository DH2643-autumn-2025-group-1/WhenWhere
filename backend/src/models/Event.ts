import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description?: string;
  creatorId: string;
  dateOptions: Date[];
  places: string[];
  availability: { userId: string; availableSlots: Date[] }[];
  suggestions: { placeName: string; availableDates: Date[]; votes: number }[];
}

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  creatorId: { type: String, required: true },
  dateOptions: [{ type: Date, required: true }],
  places: [{ type: String }],
  availability: [
    {
      userId: { type: String },
      availableSlots: [Date],
    },
  ],
  suggestions: [
    {
      placeName: { type: String },
      availableDates: [Date],
      votes: { type: Number, default: 0 },
    },
  ],
});

export default mongoose.model<IEvent>("Event", EventSchema);

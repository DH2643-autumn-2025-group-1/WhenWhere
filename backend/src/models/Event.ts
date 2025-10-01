import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  creatorId: string;
  dateOptions: Date[];
  availability: { userId: string; availableSlots: Date[] }[];
  suggestions: { placeName: string; availableDates: Date[]; votes: number }[];
}

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  creatorId: { type: String, required: true },
  dateOptions: [{ type: Date, required: true }],
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

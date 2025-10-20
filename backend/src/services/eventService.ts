import Event, { IEvent } from "../models/Event";
import crypto from "crypto";

function generateShareHash(): string {
  return crypto.randomBytes(12).toString("base64url");
}

export async function getAllEvents(): Promise<IEvent[]> {
  return Event.find();
}

export async function createEvent(data: Partial<IEvent>): Promise<IEvent> {
  const event = new Event({
    ...data,
    shareHash: data.shareHash ?? generateShareHash(),
  });
  await event.save();
  return event;
}

export async function deleteEvent(eventId: string): Promise<void> {
  await Event.findByIdAndDelete(eventId);
}

// get events created by a specific user
export async function getEventsCreatedByUser(
  userId: string,
): Promise<IEvent[]> {
  return Event.find({ creatorId: userId });
}

// get events where user is invited (in availability list)
export async function getEventsUserIsInvitedTo(
  userId: string,
): Promise<IEvent[]> {
  return Event.find({ "availability.userId": userId });
}

export async function getEventByShareHash(
  shareHash: string,
): Promise<IEvent | null> {
  return Event.findOne({ shareHash });
}

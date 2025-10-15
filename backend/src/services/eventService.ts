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
  try {
    await Event.findByIdAndDelete(eventId);
  } catch (err) {
    console.error("Error deleting event:", err);
    throw err;
  }
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

export async function updateEventAvailability(
  eventId: string,
  userId: string,
  availableSlots: (Date | string)[],
): Promise<IEvent | null> {
  const event = await Event.findById(eventId);
  if (!event) return null;

  const now = new Date();
  const sanitizedSlots = (availableSlots || [])
    .map((d) => new Date(d))
    .filter((d) => !isNaN(d.getTime()) && d.getTime() >= now.getTime());

  const allowedDays = new Set(
    (event.dateOptions || []).map((d) => new Date(d).toDateString()),
  );
  const finalSlots = sanitizedSlots.filter((d) =>
    allowedDays.has(d.toDateString()),
  );

  const existing = event.availability.find((a) => a.userId === userId);
  if (existing) {
    existing.availableSlots = finalSlots;
  } else {
    event.availability.push({ userId, availableSlots: finalSlots });
  }

  await event.save();
  return event;
}

export async function getEventByShareHash(
  shareHash: string,
): Promise<IEvent | null> {
  return Event.findOne({ shareHash });
}

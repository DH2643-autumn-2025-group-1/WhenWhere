import Event, { IEvent } from "../models/Event";
import crypto from "crypto";

export async function getAllEvents(): Promise<IEvent[]> {
  return Event.find();
}

export async function createEvent(data: Partial<IEvent>): Promise<IEvent> {
  const event = new Event(data);
  return event.save();
}

export async function createInviteLink(eventId: string) {
  let token;
  do {
    token = crypto.randomBytes(16).toString("hex");
  } while (await Event.findOne({ "inviteLinks.token": token }));

  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  event.inviteLinks.push({ token, createdAt: new Date() });
  await event.save();

  return `https://yourdomain.com/invite/${token}`;
}

export async function getEventByInviteToken(token: string) {
  const event = await Event.findOne({ "inviteLinks.token": token });
  if (!event) throw new Error("Invalid invite link");
  return event;
}

export async function deleteEvent(eventId: string): Promise<void> {
  await Event.findByIdAndDelete(eventId);
}

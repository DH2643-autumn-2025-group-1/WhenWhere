import Event, { IEvent } from "../models/Event";

export async function getAllEvents(): Promise<IEvent[]> {
  return Event.find();
}

export async function createEvent(data: Partial<IEvent>): Promise<IEvent> {
  const event = new Event(data);
  return event.save();
}

export async function deleteEvent(eventId: string): Promise<IEvent | null> {
  return Event.findByIdAndDelete(eventId);
}

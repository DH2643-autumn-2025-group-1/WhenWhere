import Event, { IEvent } from "../models/Event";

export async function getAllEvents(): Promise<IEvent[]> {
  return Event.find();
}

export async function createEvent(data: Partial<IEvent>): Promise<IEvent> {
  const event = new Event(data);
  return event.save();
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
export async function deleteEvent(eventId: string): Promise<IEvent | null> {
  return Event.findByIdAndDelete(eventId);
}

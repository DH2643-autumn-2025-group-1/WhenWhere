import { Router } from "express";
import type { Availability } from "../models/Event";
import Event from "../models/Event";
import {
  getAllEvents,
  createEvent,
  deleteEvent,
  getEventsCreatedByUser,
  getEventsUserIsInvitedTo,
  getEventByShareHash,
} from "../services/eventService";

const router = Router();

// GET /events → list all events
router.get("/", async (_req, res) => {
  try {
    const events = await getAllEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events", details: err });
  }
});

// GET /events/hash/:shareHash → resolve event by share hash
router.get("/hash/:shareHash", async (req, res) => {
  try {
    const event = await getEventByShareHash(req.params.shareHash);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch event by hash", details: err });
  }
});

// POST /events → create new event
router.post("/", async (req, res) => {
  try {
    const event = await createEvent(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: "Failed to create event", err });
  }
});

// DELETE /events/:id → delete event by ID
router.delete("/:id", async (req, res) => {
  try {
    const eventId = req.params.id;
    await deleteEvent(eventId);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete event", details: err });
  }
});

// GET /events/created/:userId → events the user created
router.get("/created/:userId", async (req, res) => {
  try {
    const events = await getEventsCreatedByUser(req.params.userId);
    res.json(events);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch created events", details: err });
  }
});

// GET /events/invited/:userId → events where user is invited
router.get("/invited/:userId", async (req, res) => {
  try {
    const events = await getEventsUserIsInvitedTo(req.params.userId);
    res.json(events);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch invited events", details: err });
  }
});

router.put("/:id/availability", async (req, res) => {
  const { userId, username, availableSlots, votedLocation } = req.body;

  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const userAvailability: Availability | undefined = event.availability.find(
      (a) => a.userId === userId,
    );

    if (userAvailability) {
      if (Array.isArray(availableSlots)) {
        userAvailability.availableSlots = availableSlots;
      }
      if (votedLocation) {
        userAvailability.votedLocation = votedLocation;
      }
      if (username) {
        userAvailability.username = username;
      }
    } else {

      if (votedLocation && event.places.length > 0) {
        const place = event.places.find((p) => p.name === votedLocation.name);
        if (place) {
          place.votes.push(userId);
        }
      }
      event.availability.push({
        userId,
        username,
        availableSlots: availableSlots || [],
        votedLocation: votedLocation || null,
      });
    }

    await event.save();
    res.json(event);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update availability", details: err });
  }
});

export default router;

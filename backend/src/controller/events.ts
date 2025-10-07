import { Router } from "express";
import {
  getAllEvents,
  createEvent,
  deleteEvent,
  getEventsCreatedByUser,
  getEventsUserIsInvitedTo,
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

// POST /events → create new event
router.post("/", async (req, res) => {
  try {
    const event = await createEvent(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: "Failed to create event", details: err });
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
    res.status(500).json({ error: "Failed to fetch created events", details: err });
  }
});

// GET /events/invited/:userId → events where user is invited
router.get("/invited/:userId", async (req, res) => {
  try {
    const events = await getEventsUserIsInvitedTo(req.params.userId);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch invited events", details: err });
  }
});


export default router;

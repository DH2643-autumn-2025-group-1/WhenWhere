import { Router } from "express";
import {
  getAllEvents,
  createEvent, 
  createInviteLink, 
  getEventByInviteToken,
  deleteEvent,
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

// POST /:eventid/invite → create invite link
router.post("/:eventId/invite", async (req, res) => {
  const { eventId } = req.params;

  try {
    const link = await createInviteLink(eventId);
    res.status(201).json({ link });
  } catch (err) {
    res.status(400).json({ error: "Failed to generate invite link", details: err });
  }
});

// GET /invite/:token
router.get("/invite/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const event = await getEventByInviteToken(token);
    res.json({ event });
  } catch (err) {
    res.status(404).json({ error: "Invalid invite link", details: err });
  }
});


export default router;

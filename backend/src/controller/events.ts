import { Router } from "express";
import { getAllEvents, createEvent } from "../services/eventService";

const router = Router();

// GET /events → list all events
router.get("/", async (_req, res) => {
  try {
    const events = await getAllEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events", err });
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

export default router;

import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

import express from "express";
import { connectDB } from "./database";
import eventsRouter from "./controller/events";
import { verifyFirebaseToken } from "./firebase/firebaseVerification";
import { scheduleExpiredEventCleanup } from "./cleanup/cleanupExpiredEvents";

const app = express();
app.use(cors());
app.use(express.json());

app.use(verifyFirebaseToken);

connectDB(process.env.MONGO_URI as string);

scheduleExpiredEventCleanup();

app.use("/events", eventsRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));

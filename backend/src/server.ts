import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./database";
import eventsRouter from "./routes/events";

const app = express();
app.use(express.json());

connectDB(process.env.MONGO_URI as string);

app.use("/events", eventsRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));

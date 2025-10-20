import cron from "node-cron";
import Event from "../models/Event";

/**
 * Runs hourly and removes events whose latest dateOption has passed.
 */
export function scheduleExpiredEventCleanup() {
  // Every hour at minute 0
  cron.schedule("0 * * * *", async () => {
    const now = new Date();
    try {
      const events = await Event.find({});
      const deletions: string[] = [];

      for (const event of events) {
        if (Array.isArray(event.dateOptions) && event.dateOptions.length > 0) {
          // Find the latest (maximum) date among the event's dateOptions
          const latestDate = new Date(
            Math.max(
              ...event.dateOptions.map((d: Date) => new Date(d).getTime()),
            ),
          );

          // Delete the event only if the latest date has passed
          if (latestDate < now) {
            await Event.deleteOne({ _id: event._id });
            deletions.push(event.title ?? String(event._id));
            console.log(
              `[Cleanup] Deleted expired event "${event.title}" (last date: ${latestDate.toISOString()})`,
            );
          }
        }
      }

      if (deletions.length > 0) {
        console.log(
          `[Cleanup] Total deleted events this hour: ${deletions.length}`,
        );
      }
    } catch (err) {
      console.error("[Cleanup] Failed to delete expired events:", err);
    }
  });

  console.log("[Cleanup] Hourly expired-event cleanup scheduled.");
}

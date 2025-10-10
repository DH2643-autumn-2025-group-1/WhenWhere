import { useEffect, useState } from "react";
import type { EventModelType } from "../models/EventModel";
import { EventResult } from "../views/EventResult";

export function EventResultPresenter({ model }: { model: EventModelType }) {
  console.log(model); // TODO remove

  const [winningSlots, setWinningSlots] = useState<string[]>([]);
  const [topLocation, setTopLocation] = useState<string | null>(null);

  useEffect(() => {
    setWinningSlots([
      "Sunday 23 September 10:00 - 11:00",
      "Monday 30 October 15:00 - 16:00",
      "Tuesday 14 November 09:00 - 10:00",
    ]);
    setTopLocation("Central Park");
  }, []);

  return (
    <EventResult
      peopleVoted={[
        [
          "anna luundberg",
          "simon flisberg",
          "dgfnadsgkhnaödkfga",
          "jvgdlksjvdö",
          "kdsögkövjädsgjdgkldsöglä",
        ],
        ["anna luundberg", "simon flisberg"],
        [],
      ]}
      winningSlots={winningSlots}
      topLocation={topLocation}
    />
  );
}

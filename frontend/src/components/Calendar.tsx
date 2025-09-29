import React, { useMemo, useState, useCallback } from "react";

import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { addDays, format, isSameDay, startOfDay, startOfWeek } from "date-fns";
import { enGB } from "date-fns/locale";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  colorHex?: string;
}

type CalendarProps = {
  weekAnchor?: Date;
  events?: CalendarEvent[];
  onNavigateWeek?: (nextAnchor: Date) => void;
};

function minutesFromMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

function clampEventToDay(
  event: CalendarEvent,
  day: Date,
): { startMin: number; endMin: number } | null {
  const dayStart = startOfDay(day);
  const dayEnd = addDays(dayStart, 1);
  const start = event.start < dayStart ? dayStart : event.start;
  const end = event.end > dayEnd ? dayEnd : event.end;
  if (end <= dayStart || start >= dayEnd) return null;
  const startMin = minutesFromMidnight(start);
  const endMin = Math.max(startMin + 15, minutesFromMidnight(end));
  return { startMin, endMin };
}

const DayHeader: React.FC<{ day: Date; isToday: boolean }> = ({
  day,
  isToday,
}) => (
  <Box
    sx={{
      position: "sticky",
      top: 0,
      zIndex: 1,
      textAlign: "center",
      bgcolor: "#fff",
      borderBottom: "1px solid #e6e6e6",
      py: 1.25,
    }}
  >
    <Typography
      variant="subtitle2"
      fontWeight={800}
      letterSpacing={0.6}
      sx={{ textTransform: "uppercase" }}
    >
      {format(day, "EEE")}
    </Typography>
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 24,
        height: 24,
        borderRadius: "999px",
        border: isToday ? "2px solid #1976d2" : "1px solid #cfcfcf",
        bgcolor: isToday ? "#1976d2" : "#fff",
        mt: 0.5,
      }}
    >
      <Typography
        variant="caption"
        color={isToday ? "#fff" : "text.primary"}
        sx={{ fontWeight: 600 }}
      >
        {format(day, "d")}
      </Typography>
    </Box>
  </Box>
);

const EventBlock: React.FC<{
  event: CalendarEvent;
  clamp: { startMin: number; endMin: number };
}> = ({ event, clamp }) => {
  const totalMinutes = 24 * 60;
  const topPct = (clamp.startMin / totalMinutes) * 100;
  const heightPct = ((clamp.endMin - clamp.startMin) / totalMinutes) * 100;
  const background = event.colorHex ?? "#d86a6a";

  return (
    <Box
      sx={{
        position: "absolute",
        top: `${topPct}%`,
        left: 10,
        right: 10,
        height: `${heightPct}%`,
        bgcolor: background,
        color: "#fff",
        borderRadius: 2,
        boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
        px: 1,
        py: 0.5,
        overflow: "hidden",
        pointerEvents: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 0.25,
      }}
    >
      <Typography variant="caption" fontWeight={700} noWrap>
        {event.title}
      </Typography>
      <Typography variant="caption" sx={{ opacity: 0.9 }} noWrap>
        {format(event.start, "HH:mm")} – {format(event.end, "HH:mm")}
      </Typography>
    </Box>
  );
};

const Calendar: React.FC<CalendarProps> = ({
  events = [],
  weekAnchor: externalAnchor,
  onNavigateWeek,
}) => {
  const [internalAnchor, setInternalAnchor] = useState<Date>(
    externalAnchor ?? new Date(),
  );
  const weekAnchor = externalAnchor ?? internalAnchor;

  const weekStart = useMemo(
    () => startOfWeek(weekAnchor, { weekStartsOn: 1, locale: enGB }),
    [weekAnchor],
  );

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const hours = useMemo(() => Array.from({ length: 24 }, (_, h) => h), []);

  const navigateWeek = useCallback(
    (direction: "prev" | "next") => {
      const next = addDays(weekAnchor, direction === "prev" ? -7 : 7);
      setInternalAnchor(next);
      onNavigateWeek?.(next);
    },
    [weekAnchor, onNavigateWeek],
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      width="100%"
      px={3}
      py={2}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={2}
        py={1}
        borderBottom="1px solid transparent"
        bgcolor="transparent"
        position="sticky"
        top={0}
        zIndex={2}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={() => navigateWeek("prev")} size="small">
            <ArrowBackIosNewIcon fontSize="inherit" />
          </IconButton>
          <IconButton onClick={() => navigateWeek("next")} size="small">
            <ArrowForwardIosIcon fontSize="inherit" />
          </IconButton>
        </Box>
        <Typography variant="subtitle1" fontWeight={700} color="text.primary">
          Week {format(weekStart, "II")}
        </Typography>
        <Box width={40} />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "96px repeat(7, 1fr)",
          gridTemplateRows: "80px repeat(24, 1fr)",
          height: "100%",
          minHeight: "85vh",
          width: "100%",
          maxWidth: 1280,
          mx: "auto",
          overflow: "auto",
          position: "relative",
          backgroundColor: "#fff",
          borderRadius: 3,
          boxShadow: "inset 0 0 0 1px #eee",
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            left: 0,
            zIndex: 2,
            bgcolor: "#fff",
            borderBottom: "1px solid #eee",
          }}
        />

        {weekDays.map((day) => (
          <DayHeader
            key={day.toISOString()}
            day={day}
            isToday={isSameDay(day, new Date())}
          />
        ))}

        {hours.map((hour) => {
          const rowIndex = hour + 2;
          return (
            <React.Fragment key={hour}>
              <Box
                sx={{
                  gridRow: rowIndex,
                  gridColumn: 1,
                  position: "sticky",
                  left: 0,
                  zIndex: 1,
                  bgcolor: "#fafafa",
                  borderRight: "1px solid #e8e8e8",
                  borderBottom: "1px solid #efefef",
                  px: 1.25,
                  display: "flex",
                  alignItems: "center",
                  fontSize: 13,
                  color: "#8a8a8a",
                }}
              >
                {String(hour).padStart(2, "0")}:00
              </Box>

              {weekDays.map((day, dayIndex) => {
                return (
                  <Box
                    key={`${day.toISOString()}-${hour}`}
                    sx={{
                      gridRow: rowIndex,
                      gridColumn: dayIndex + 2,
                      borderRight: "1px solid #efefef",
                      borderBottom: "1px solid #efefef",
                      backgroundColor: "#fff",
                    }}
                  />
                );
              })}
            </React.Fragment>
          );
        })}

        {weekDays.map((day, dayIndex) => {
          const dayEvents = events
            .filter(
              (ev) =>
                isSameDay(ev.start, day) ||
                isSameDay(ev.end, day) ||
                (ev.start < day && ev.end > addDays(day, 0)),
            )
            .map((ev) => ({ ev, clamp: clampEventToDay(ev, day) }))
            .filter(
              (
                x,
              ): x is {
                ev: CalendarEvent;
                clamp: { startMin: number; endMin: number };
              } => !!x.clamp,
            )
            .sort((a, b) => a.clamp.startMin - b.clamp.startMin);

          return (
            <Box
              key={`overlay-${day.toISOString()}`}
              sx={{
                gridColumn: dayIndex + 2,
                gridRow: "2 / span 24",
                position: "relative",
                pointerEvents: "none",
              }}
            >
              {dayEvents.map(({ ev, clamp }) => (
                <EventBlock key={ev.id} event={ev} clamp={clamp} />
              ))}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Calendar;

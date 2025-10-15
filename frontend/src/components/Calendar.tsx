import React, { useMemo, useState, useCallback } from "react";
import styled from "styled-components";

import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { addDays, format, isSameDay, startOfDay, startOfWeek } from "date-fns";
import { enGB } from "date-fns/locale";
import { userService } from "../services/userService";

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
  heatmapData?: { userId: string; availableSlots: Date[] | string[] }[];
  currentUserId?: string | null;
};

const CalendarContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const NavigationHeader = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) => props.theme.spacing.medium};
  border-bottom: 1px solid transparent;
  background-color: transparent;
  position: sticky;
  top: 0;
  z-index: 2;
`;

const NavigationControls = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WeekNumber = styled(Typography)`
  font-weight: 700;
  color: #000;
`;

const Spacer = styled(Box)`
  width: 40px;
`;

const CalendarGrid = styled(Box)`
  display: grid;
  grid-template-columns: 96px repeat(7, 1fr);
  grid-template-rows: 80px repeat(24, 1fr);
  height: 100%;
  min-height: 85vh;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  overflow: auto;
  position: relative;
`;

const CornerCell = styled(Box)`
  position: sticky;
  top: 0;
  left: 0;
  z-index: 2;
  background-color: #fff;
  border-bottom: 1px solid #eee;
`;

const DayHeaderContainer = styled(Box)<{ $isToday: boolean }>`
  position: sticky;
  top: 0;
  z-index: 1;
  text-align: center;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  padding: 10px 0;
`;

const DayNumber = styled(Box)<{ $isToday: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  border: ${(props) =>
    props.$isToday ? "2px solid #1976d2" : "1px solid #cfcfcf"};
  background-color: ${(props) => (props.$isToday ? "#1976d2" : "#fff")};
  margin-top: 4px;
  min-width: 24px;
  min-height: 24px;
`;

const DayNumberText = styled(Typography)<{ $isToday: boolean }>`
  color: ${(props) => (props.$isToday ? "#fff" : "#000")};
  font-weight: 600;
  font-size: 12px;
  line-height: 1;
`;

const HourLabel = styled(Box)<{ $rowIndex: number }>`
  grid-row: ${(props) => props.$rowIndex};
  grid-column: 1;
  position: sticky;
  left: 0;
  z-index: 1;
  background-color: #fafafa;
  border-right: 1px solid #e8e8e8;
  border-bottom: 1px solid #efefef;
  padding: 0 10px;
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #8a8a8a;
`;

const DayCell = styled(Box)<{ $rowIndex: number; $dayIndex: number }>`
  grid-row: ${(props) => props.$rowIndex};
  grid-column: ${(props) => props.$dayIndex + 2};
  border-right: 1px solid #efefef;
  border-bottom: 1px solid #efefef;
  background-color: #fff;
  position: relative;
`;

const HeatCell = styled(Box)<{
  $intensity: number; // 0..1
}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => {
    if (props.$intensity <= 0) return "transparent";
    const alpha = 0.15 + props.$intensity * 0.55;
    return `rgba(25, 118, 210, ${alpha})`;
  }};
  transition: background-color 0.15s ease;
  pointer-events: auto;
`;

const EventOverlay = styled(Box)<{ $dayIndex: number }>`
  grid-column: ${(props) => props.$dayIndex + 2};
  grid-row: 2 / span 24;
  position: relative;
  pointer-events: none;
`;

const StyledEventBlock = styled(Box)<{
  $topPct: number;
  $heightPct: number;
  $backgroundColor: string;
}>`
  position: absolute;
  top: ${(props) => props.$topPct}%;
  left: 10px;
  right: 10px;
  height: ${(props) => props.$heightPct}%;
  background-color: ${(props) => props.$backgroundColor};
  color: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  padding: 4px 8px;
  overflow: hidden;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const EventTitle = styled(Typography)`
  font-weight: 700;
  white-space: nowrap;
`;

const EventTime = styled(Typography)`
  opacity: 0.9;
  white-space: nowrap;
`;

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
  <DayHeaderContainer $isToday={isToday}>
    <Typography
      variant="subtitle2"
      fontWeight={800}
      letterSpacing={0.6}
      sx={{ textTransform: "uppercase" }}
    >
      {format(day, "EEE")}
    </Typography>
    <DayNumber $isToday={isToday}>
      <DayNumberText variant="caption" $isToday={isToday}>
        {format(day, "d")}
      </DayNumberText>
    </DayNumber>
  </DayHeaderContainer>
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
    <StyledEventBlock
      $topPct={topPct}
      $heightPct={heightPct}
      $backgroundColor={background}
    >
      <EventTitle variant="caption">{event.title}</EventTitle>
      <EventTime variant="caption">
        {format(event.start, "HH:mm")} – {format(event.end, "HH:mm")}
      </EventTime>
    </StyledEventBlock>
  );
};

const Calendar: React.FC<CalendarProps> = ({
  events = [],
  weekAnchor: externalAnchor,
  onNavigateWeek,
  heatmapData,
  currentUserId,
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

  const { heatmapCounts, heatmapUsers, maxCount } = useMemo(() => {
    if (!heatmapData)
      return { heatmapCounts: [], heatmapUsers: [], maxCount: 0 };

    const counts: number[][] = Array.from({ length: 7 }, () =>
      Array.from({ length: 24 }, () => 0),
    );
    const usersAt: Array<Array<Array<string>>> = Array.from({ length: 7 }, () =>
      Array.from({ length: 24 }, () => [] as string[]),
    );

    for (const entry of heatmapData) {
      for (const raw of entry.availableSlots || []) {
        const d =
          raw instanceof Date ? raw : new Date(raw as unknown as string);
        const dayIndex = weekDays.findIndex((day) => isSameDay(day, d));
        if (dayIndex === -1) continue;
        const hour = d.getHours();
        counts[dayIndex][hour] += 1;
        const list = usersAt[dayIndex][hour];
        if (!list.includes(entry.userId)) list.push(entry.userId);
      }
    }

    let max = 0;
    counts.forEach((col) => col.forEach((c) => (max = Math.max(max, c))));
    return { heatmapCounts: counts, heatmapUsers: usersAt, maxCount: max };
  }, [heatmapData, weekDays]);

  const [userNameMap, setUserNameMap] = React.useState<Record<string, string>>(
    {},
  );
  React.useEffect(() => {
    if (!heatmapData) return;

    let cancelled = false;
    async function loadNames() {
      const ids = new Set<string>();
      heatmapUsers.forEach((perDay) =>
        perDay.forEach((perHour) => perHour.forEach((id) => ids.add(id))),
      );

      try {
        const names = await userService.getUserDisplayNames(
          Array.from(ids),
          currentUserId,
        );

        if (!cancelled) {
          setUserNameMap(names);
        }
      } catch (error) {
        console.error("Failed to load user names:", error);
        if (!cancelled) {
          // Fallback to user IDs if service fails
          const fallbackNames = Object.fromEntries(
            Array.from(ids).map((id) => [id, `User ${id.slice(0, 8)}`]),
          );
          setUserNameMap(fallbackNames);
        }
      }
    }
    loadNames();
    return () => {
      cancelled = true;
    };
  }, [heatmapUsers, currentUserId, heatmapData]);

  const navigateWeek = useCallback(
    (direction: "prev" | "next") => {
      const next = addDays(weekAnchor, direction === "prev" ? -7 : 7);
      setInternalAnchor(next);
      onNavigateWeek?.(next);
    },
    [weekAnchor, onNavigateWeek],
  );

  return (
    <CalendarContainer>
      <NavigationHeader>
        <NavigationControls>
          <IconButton onClick={() => navigateWeek("prev")} size="small">
            <ArrowBackIosNewIcon fontSize="inherit" />
          </IconButton>
          <IconButton onClick={() => navigateWeek("next")} size="small">
            <ArrowForwardIosIcon fontSize="inherit" />
          </IconButton>
        </NavigationControls>
        <WeekNumber variant="subtitle1">
          Week {format(weekStart, "II")}
        </WeekNumber>
        <Spacer />
      </NavigationHeader>

      <CalendarGrid>
        <CornerCell />

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
              <HourLabel $rowIndex={rowIndex}>
                {String(hour).padStart(2, "0")}:00
              </HourLabel>

              {weekDays.map((day, dayIndex) => {
                const count = heatmapCounts[dayIndex]?.[hour] || 0;
                const users = heatmapUsers[dayIndex]?.[hour] || [];
                const intensity = maxCount > 0 ? count / maxCount : 0;
                const title = (() => {
                  if (count === 0) return "No votes";
                  const voteText = count > 1 ? "votes" : "vote";
                  const userList = users
                    .map((u) => `• ${userNameMap[u] || u}`)
                    .join("\n");
                  return `${count} ${voteText}:\n${userList}`;
                })();

                return (
                  <DayCell
                    key={`${day.toISOString()}-${hour}`}
                    $rowIndex={rowIndex}
                    $dayIndex={dayIndex}
                  >
                    {count > 0 && (
                      <Tooltip title={title} arrow>
                        <HeatCell $intensity={intensity} />
                      </Tooltip>
                    )}
                  </DayCell>
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
            <EventOverlay
              key={`overlay-${day.toISOString()}`}
              $dayIndex={dayIndex}
            >
              {dayEvents.map(({ ev, clamp }) => (
                <EventBlock key={ev.id} event={ev} clamp={clamp} />
              ))}
            </EventOverlay>
          );
        })}
      </CalendarGrid>
    </CalendarContainer>
  );
};

export default Calendar;

import React, { useState, useCallback, useRef, useLayoutEffect } from "react";
import styled from "styled-components";
import { Box } from "@mui/material";
import Calendar from "../components/Calendar";
import { addDays, isSameDay, startOfWeek } from "date-fns";
import { enGB } from "date-fns/locale";

interface TimeSlot {
  day: Date;
  hour: number;
  minute: number;
}

type RoundedProps = {
  $isSelected: boolean;
  $topRounded: boolean;
  $bottomRounded: boolean;
};

function computeBorderRadius(props: RoundedProps): string {
  if (!props.$isSelected) return "0";
  if (props.$topRounded && props.$bottomRounded) return "16px";
  if (props.$topRounded) return "16px 16px 0 0";
  if (props.$bottomRounded) return "0 0 16px 16px";
  return "0";
}

function buildRangeSlots(
  weekDays: Date[],
  startDay: number,
  endDay: number,
  startHour: number,
  endHour: number,
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (let d = startDay; d <= endDay; d++) {
    for (let h = startHour; h <= endHour; h++) {
      slots.push({ day: weekDays[d], hour: h, minute: 0 });
    }
  }
  return slots;
}

function toggleSlots(prev: TimeSlot[], range: TimeSlot[]): TimeSlot[] {
  const next = [...prev];
  range.forEach((slot) => {
    const idx = next.findIndex(
      (s) => isSameDay(s.day, slot.day) && s.hour === slot.hour,
    );
    if (idx >= 0) next.splice(idx, 1);
    else next.push(slot);
  });
  return next;
}

const CalendarWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 16px 24px;
  position: relative;
`;

const TimeSelectionOverlay = styled(Box)<{
  $topPx: number;
  $leftPx: number;
  $widthPx: number;
  $heightPx: number;
}>`
  position: absolute;
  top: ${(props) => props.$topPx}px;
  left: ${(props) => props.$leftPx}px;
  width: ${(props) => props.$widthPx}px;
  height: ${(props) => props.$heightPx}px;
  pointer-events: none;
  z-index: 5;
  display: grid;
  grid-template-columns: 96px repeat(7, 1fr);
  grid-template-rows: repeat(24, 1fr);
  overflow: auto;
  background-color: transparent;
  border-radius: 24px;
`;

const TimeSlot = styled(Box)<{
  $rowIndex: number;
  $dayIndex: number;
  $isSelected: boolean;
  $topRounded: boolean;
  $bottomRounded: boolean;
}>`
  grid-row: ${(props) => props.$rowIndex};
  grid-column: ${(props) => props.$dayIndex + 2};
  background-color: ${(props) =>
    props.$isSelected ? "#e3f2fd" : "transparent"};
  transition: all 0.2s ease;
  pointer-events: none;
  position: relative;
  z-index: 10;
  border-radius: ${(p) => computeBorderRadius(p)};

  &:hover {
    background-color: ${(props) => (props.$isSelected ? "#bbdefb" : "#f5f5f5")};
  }
`;

const AvailabilityCalendar = () => {
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>([]);
  const [weekAnchor, setWeekAnchor] = useState<Date>(new Date());
  const overlayRef = useRef<HTMLDivElement>(null);
  const calendarHostRef = useRef<HTMLDivElement>(null);
  const [overlayTopPx, setOverlayTopPx] = useState<number>(0);
  const [overlayLeftPx, setOverlayLeftPx] = useState<number>(0);
  const [overlayWidthPx, setOverlayWidthPx] = useState<number>(0);
  const [overlayHeightPx, setOverlayHeightPx] = useState<number>(0);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectStart, setSelectStart] = useState<{
    dayIdx: number;
    hour: number;
  } | null>(null);
  const [selectEnd, setSelectEnd] = useState<{
    dayIdx: number;
    hour: number;
  } | null>(null);

  const weekStart = startOfWeek(weekAnchor, { weekStartsOn: 1, locale: enGB });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 24 }, (_, h) => h);

  const handleNavigateWeek = useCallback((nextAnchor: Date) => {
    setWeekAnchor(nextAnchor);
  }, []);

  const isTimeSlotSelected = useCallback(
    (day: Date, hour: number) => {
      return selectedTimeSlots.some(
        (slot) => isSameDay(slot.day, day) && slot.hour === hour,
      );
    },
    [selectedTimeSlots],
  );

  useLayoutEffect(() => {
    const host = calendarHostRef.current;
    if (!host) return;
    const calendarRoot = host.firstElementChild as HTMLElement | null;
    if (!calendarRoot) return;
    const calendarGrid = calendarRoot.lastElementChild as HTMLElement | null;
    if (!calendarGrid) return;

    const rootRect = host.getBoundingClientRect();
    const gridRect = calendarGrid.getBoundingClientRect();
    const HEADER_ROW_PX = 80;
    const topPx = gridRect.top - rootRect.top + HEADER_ROW_PX;
    const leftPx = gridRect.left - rootRect.left;
    const widthPx = gridRect.width;
    const heightPx = gridRect.height - HEADER_ROW_PX;
    setOverlayTopPx(topPx);
    setOverlayLeftPx(leftPx);
    setOverlayWidthPx(widthPx);
    setOverlayHeightPx(heightPx);

    const handleResize = () => {
      const rr = host.getBoundingClientRect();
      const gr = calendarGrid.getBoundingClientRect();
      setOverlayTopPx(gr.top - rr.top + HEADER_ROW_PX);
      setOverlayLeftPx(gr.left - rr.left);
      setOverlayWidthPx(gr.width);
      setOverlayHeightPx(gr.height - HEADER_ROW_PX);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [weekAnchor]);

  const getIndicesFromEvent = useCallback((evt: React.MouseEvent) => {
    const el = overlayRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;
    const timeCol = 96;
    const dayWidth = (rect.width - timeCol) / 7;
    const hourHeight = rect.height / 24;
    const dayIdx = Math.min(
      6,
      Math.max(0, Math.floor((x - timeCol) / dayWidth)),
    );
    const hour = Math.min(23, Math.max(0, Math.floor(y / hourHeight)));
    if (isNaN(dayIdx) || isNaN(hour)) return null;
    return { dayIdx, hour };
  }, []);

  const handleOverlayMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const idx = getIndicesFromEvent(e);
      if (!idx) return;
      setIsSelecting(true);
      setSelectStart(idx);
      setSelectEnd(idx);
    },
    [getIndicesFromEvent],
  );

  const handleOverlayMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isSelecting || !selectStart) return;
      const idx = getIndicesFromEvent(e);
      if (!idx) return;
      setSelectEnd(idx);
    },
    [isSelecting, selectStart, getIndicesFromEvent],
  );

  const handleOverlayMouseUp = useCallback(() => {
    if (!isSelecting || !selectStart || !selectEnd) {
      setIsSelecting(false);
      return;
    }
    const startDay = Math.min(selectStart.dayIdx, selectEnd.dayIdx);
    const endDay = Math.max(selectStart.dayIdx, selectEnd.dayIdx);
    const startHour = Math.min(selectStart.hour, selectEnd.hour);
    const endHour = Math.max(selectStart.hour, selectEnd.hour);
    const rangeSlots = buildRangeSlots(
      weekDays,
      startDay,
      endDay,
      startHour,
      endHour,
    );
    setSelectedTimeSlots((prev) => toggleSlots(prev, rangeSlots));
    setIsSelecting(false);
    setSelectStart(null);
    setSelectEnd(null);
  }, [isSelecting, selectStart, selectEnd, weekDays]);

  return (
    <CalendarWrapper ref={calendarHostRef}>
      <Calendar weekAnchor={weekAnchor} onNavigateWeek={handleNavigateWeek} />
      <TimeSelectionOverlay
        $topPx={overlayTopPx}
        $leftPx={overlayLeftPx}
        $widthPx={overlayWidthPx}
        $heightPx={overlayHeightPx}
        ref={overlayRef}
        onMouseDown={handleOverlayMouseDown}
        onMouseMove={handleOverlayMouseMove}
        onMouseUp={handleOverlayMouseUp}
        style={{
          pointerEvents: "auto",
          cursor: isSelecting ? "crosshair" : "default",
        }}
      >
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <Box style={{ pointerEvents: "none" }} />

            {weekDays.map((day, dayIndex) => {
              const isSelected = isTimeSlotSelected(day, hour);
              const prevSelected =
                hour > 0 && isTimeSlotSelected(day, hour - 1);
              const nextSelected =
                hour < 23 && isTimeSlotSelected(day, hour + 1);
              const topRounded = isSelected && !prevSelected;
              const bottomRounded = isSelected && !nextSelected;
              return (
                <TimeSlot
                  key={`${day.toISOString()}-${hour}`}
                  $rowIndex={hour + 1}
                  $dayIndex={dayIndex}
                  $isSelected={isSelected}
                  $topRounded={topRounded}
                  $bottomRounded={bottomRounded}
                />
              );
            })}
          </React.Fragment>
        ))}
        {isSelecting && selectStart && selectEnd && (
          <Box
            sx={{
              gridRow: `${Math.min(selectStart.hour, selectEnd.hour) + 1} / ${
                Math.max(selectStart.hour, selectEnd.hour) + 2
              }`,
              gridColumn: `${Math.min(selectStart.dayIdx, selectEnd.dayIdx) + 2} / ${
                Math.max(selectStart.dayIdx, selectEnd.dayIdx) + 3
              }`,
              backgroundColor: "rgba(25,118,210,0.12)",
              border: "2px solid #1976d2",
              borderRadius: "12px",
              pointerEvents: "none",
              zIndex: 20,
            }}
          />
        )}
      </TimeSelectionOverlay>
    </CalendarWrapper>
  );
};

export default AvailabilityCalendar;

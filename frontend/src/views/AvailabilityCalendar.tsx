import React from "react";
import styled from "styled-components";
import { Box } from "@mui/material";
import Calendar from "../components/Calendar";

const CalendarWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
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
  border-radius: ${(p) => {
    if (!p.$isSelected) return "0";
    if (p.$topRounded && p.$bottomRounded) return "16px";
    if (p.$topRounded) return "16px 16px 0 0";
    if (p.$bottomRounded) return "0 0 16px 16px";
    return "0";
  }};

  &:hover {
    background-color: ${(props) => (props.$isSelected ? "#bbdefb" : "#f5f5f5")};
  }
`;

type SelectionIndex = { dayIdx: number; hour: number };

interface AvailabilityCalendarProps {
  calendarHostRef: React.RefObject<HTMLDivElement | null>;
  overlayRef: React.RefObject<HTMLDivElement | null>;
  overlayTopPx: number;
  overlayLeftPx: number;
  overlayWidthPx: number;
  overlayHeightPx: number;
  weekAnchor: Date;
  weekDays: Date[];
  hours: number[];
  isSelecting: boolean;
  selectStart: SelectionIndex | null;
  selectEnd: SelectionIndex | null;
  isTimeSlotSelected: (day: Date, hour: number) => boolean;
  handleNavigateWeek: (nextAnchor: Date) => void;
  handleOverlayMouseDown: (e: React.MouseEvent) => void;
  handleOverlayMouseMove: (e: React.MouseEvent) => void;
  handleOverlayMouseUp: () => void;
}

export function AvailabilityCalendar({
  calendarHostRef,
  overlayRef,
  overlayTopPx,
  overlayLeftPx,
  overlayWidthPx,
  overlayHeightPx,
  weekAnchor,
  weekDays,
  hours,
  isSelecting,
  selectStart,
  selectEnd,
  isTimeSlotSelected,
  handleNavigateWeek,
  handleOverlayMouseDown,
  handleOverlayMouseMove,
  handleOverlayMouseUp,
}: Readonly<AvailabilityCalendarProps>) {
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
}

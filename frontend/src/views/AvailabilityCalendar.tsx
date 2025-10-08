import React, { useState } from "react";
import styled from "styled-components";
import { Box, Button, TextField, Typography } from "@mui/material";
import Calendar from "../components/Calendar";

const PageLayout = styled(Box)`
  display: flex;
  gap: 24px;
  width: 100%;
  height: 100%;
  padding: 16px 24px;
  align-items: center;
`;

const CalendarWrapper = styled(Box)`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
`;

const Sidebar = styled(Box)`
  width: 280px;
  min-width: 280px;
  border-radius: 16px;
  background: #f6f6f6;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OptionButton = styled(Button)<{ $active?: boolean }>`
  justify-content: flex-start;
  text-transform: none;
  background: ${(p) => (p.$active ? "#e3f2fd" : "white")};
  color: #333;
  border: 1px solid ${(p) => (p.$active ? "#90caf9" : "#ddd")};
  border-radius: 12px;
  padding: 10px 12px;
  &:hover {
    background: ${(p) => (p.$active ? "#bbdefb" : "#f5f5f5")};
  }
`;

const ContinueButton = styled(Button)<{ $disabled?: boolean }>`
  position: absolute;
  top: 80px;
  right: 16px;
  background: ${(p) => (p.$disabled ? "#e0e0e0" : "#1976d2")};
  color: ${(p) => (p.$disabled ? "#9e9e9e" : "white")};
  text-transform: none;
  border-radius: 12px;
  padding: 10px 24px;
  font-weight: 600;
  z-index: 100;
  cursor: ${(p) => (p.$disabled ? "not-allowed" : "pointer")};
  &:hover {
    background: ${(p) => (p.$disabled ? "#e0e0e0" : "#1565c0")};
  }
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
  const [location, setLocation] = useState<{
    type: "remote" | "onsite" | "custom";
    label: string;
  } | null>(null);
  const [customOpen, setCustomOpen] = useState<boolean>(false);
  const [customLabel, setCustomLabel] = useState<string>("");

  const setRemote = () => setLocation({ type: "remote", label: "Distans" });
  const setOnsite = () => setLocation({ type: "onsite", label: "On site" });
  const toggleCustom = () => setCustomOpen((v) => !v);
  const confirmCustom = () => {
    if (customLabel.trim().length === 0) return;
    setLocation({ type: "custom", label: customLabel.trim() });
    setCustomOpen(false);
  };

  // Check if any time slots are selected
  const hasSelectedTimeSlots = weekDays.some((day) =>
    hours.some((hour) => isTimeSlotSelected(day, hour)),
  );

  // Check if continue button should be enabled
  const isContinueEnabled = hasSelectedTimeSlots && location !== null;

  return (
    <PageLayout>
      <ContinueButton
        variant="contained"
        $disabled={!isContinueEnabled}
        disabled={!isContinueEnabled}
      >
        Continue
      </ContinueButton>
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
      <Sidebar>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
          Location
        </Typography>
        <OptionButton
          variant="contained"
          $active={location?.type === "remote"}
          onClick={setRemote}
        >
          Distans
        </OptionButton>
        <OptionButton
          variant="contained"
          $active={location?.type === "onsite"}
          onClick={setOnsite}
        >
          On site
        </OptionButton>
        <OptionButton
          variant="contained"
          onClick={toggleCustom}
          $active={location?.type === "custom"}
        >
          {location?.type === "custom" ? location.label : "+ Add place"}
        </OptionButton>
        {customOpen && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type a place..."
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
            />
            <Button variant="contained" onClick={confirmCustom}>
              Add
            </Button>
          </Box>
        )}
      </Sidebar>
    </PageLayout>
  );
}

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  addDays,
  isBefore,
  isSameDay,
  startOfDay,
  startOfWeek,
} from "date-fns";
import { enGB } from "date-fns/locale";
import { AvailabilityCalendar } from "../views/AvailabilityCalendar";
import { observer } from "mobx-react-lite";
import type { EventModelType } from "../models/EventModel";

type SelectionIndex = { dayIdx: number; hour: number };

export interface TimeSlot {
  day: Date;
  hour: number;
  minute: number;
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

export const AvailabilityPresenter = observer(
  ({
    model,
    setHaveVotedTime,
    onSelectedChange,
  }: Readonly<{
    model?: EventModelType;
    setHaveVotedTime: (value: boolean) => void;
    onSelectedChange?: (dates: Date[]) => void;
  }>) => {
    const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>([]);
    const [weekAnchor, setWeekAnchor] = useState<Date>(new Date());

    const overlayRef = useRef<HTMLDivElement>(null);
    const calendarHostRef = useRef<HTMLDivElement>(null);

    const [overlayTopPx, setOverlayTopPx] = useState<number>(0);
    const [overlayLeftPx, setOverlayLeftPx] = useState<number>(0);
    const [overlayWidthPx, setOverlayWidthPx] = useState<number>(0);
    const [overlayHeightPx, setOverlayHeightPx] = useState<number>(0);

    const [isSelecting, setIsSelecting] = useState(false);
    const [selectStart, setSelectStart] = useState<SelectionIndex | null>(null);
    const [selectEnd, setSelectEnd] = useState<SelectionIndex | null>(null);

    const weekStart = useMemo(
      () => startOfWeek(weekAnchor, { weekStartsOn: 1, locale: enGB }),
      [weekAnchor],
    );
    const weekDays = useMemo(
      () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
      [weekStart],
    );
    const hours = useMemo(() => Array.from({ length: 24 }, (_, h) => h), []);

    const allowedDays = useMemo(() => {
      const options = model?.currentEvent?.dateOptions || [];
      return options.map((d) => startOfDay(new Date(d)));
    }, [model?.currentEvent?.dateOptions]);

    const isDayAllowed = useCallback(
      (day: Date) => {
        const now = new Date();
        const todayStart = startOfDay(now);

        if (isBefore(day, todayStart)) {
          return false;
        }
        return allowedDays.some((d) => isSameDay(d, day));
      },
      [allowedDays],
    );

    const minWeekStart = useMemo(() => {
      if (allowedDays.length === 0) return undefined;
      const min = allowedDays.reduce(
        (acc, cur) => (acc < cur ? acc : cur),
        allowedDays[0],
      );
      return startOfWeek(min, { weekStartsOn: 1, locale: enGB });
    }, [allowedDays]);

    const maxWeekStart = useMemo(() => {
      if (allowedDays.length === 0) return undefined;
      const max = allowedDays.reduce(
        (acc, cur) => (acc > cur ? acc : cur),
        allowedDays[0],
      );
      return startOfWeek(max, { weekStartsOn: 1, locale: enGB });
    }, [allowedDays]);

    const desiredWeekStart = useMemo(() => {
      if (allowedDays.length === 0) return undefined;
      const now = new Date();
      const todayStart = startOfDay(now);
      const sorted = [...allowedDays].sort((a, b) => a.getTime() - b.getTime());
      const firstFutureOrToday = sorted.find((d) => d >= todayStart);
      const target = firstFutureOrToday ?? sorted[0];
      return startOfWeek(target, { weekStartsOn: 1, locale: enGB });
    }, [allowedDays]);

    const hasAutoAnchoredRef = useRef(false);
    useEffect(() => {
      if (!desiredWeekStart) return;
      if (hasAutoAnchoredRef.current) return;
      setWeekAnchor(desiredWeekStart);
      hasAutoAnchoredRef.current = true;
    }, [desiredWeekStart]);

    useEffect(() => {
      setHaveVotedTime(selectedTimeSlots.length > 0);
    }, [selectedTimeSlots, setHaveVotedTime]);

    useEffect(() => {
      if (onSelectedChange) {
        const dates = selectedTimeSlots.map((slot) => {
          const d = new Date(slot.day);
          d.setHours(slot.hour, slot.minute ?? 0, 0, 0);
          return d;
        });
        onSelectedChange(dates);
      }
    }, [selectedTimeSlots, onSelectedChange]);

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
      return { dayIdx, hour } as SelectionIndex;
    }, []);

    const handleOverlayMouseDown = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        const idx = getIndicesFromEvent(e);
        if (!idx) return;
        const now = new Date();
        const todayStart = startOfDay(now);
        const selectedDay = weekDays[idx.dayIdx];

        if (!isDayAllowed(selectedDay)) {
          return;
        }
        const isPastDay = isBefore(selectedDay, todayStart);
        const isTodayPastHour =
          isSameDay(selectedDay, now) && idx.hour < now.getHours();
        if (isPastDay || isTodayPastHour) {
          return;
        }
        setIsSelecting(true);
        setSelectStart(idx);
        setSelectEnd(idx);
      },
      [getIndicesFromEvent, weekDays, isDayAllowed],
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

      const now = new Date();
      const todayStart = startOfDay(now);
      const safeRangeSlots = rangeSlots.filter((slot) => {
        const slotDate = new Date(slot.day);
        slotDate.setHours(slot.hour, slot.minute ?? 0, 0, 0);
        if (isBefore(slotDate, now)) return false;
        if (isBefore(startOfDay(slotDate), todayStart)) return false;
        if (!isDayAllowed(slot.day)) return false;
        return true;
      });
      if (safeRangeSlots.length > 0) {
        setSelectedTimeSlots((prev) => toggleSlots(prev, safeRangeSlots));
      }
      setIsSelecting(false);
      setSelectStart(null);
      setSelectEnd(null);
    }, [isSelecting, selectStart, selectEnd, weekDays, isDayAllowed]);

    // Note: model parameter is available for future use when availability data needs to be saved/loaded
    // We can access model properties like model.userId, model.myEvents, etc. when needed
    // console.debug("AvailabilityPresenter initialized with model:", model);

    return (
      <AvailabilityCalendar
        calendarHostRef={calendarHostRef}
        overlayRef={overlayRef}
        overlayTopPx={overlayTopPx}
        overlayLeftPx={overlayLeftPx}
        overlayWidthPx={overlayWidthPx}
        overlayHeightPx={overlayHeightPx}
        weekAnchor={weekAnchor}
        weekDays={weekDays}
        hours={hours}
        minWeekStart={minWeekStart}
        maxWeekStart={maxWeekStart}
        isSelecting={isSelecting}
        selectStart={selectStart}
        selectEnd={selectEnd}
        isTimeSlotSelected={isTimeSlotSelected}
        isDayAllowed={isDayAllowed}
        handleNavigateWeek={handleNavigateWeek}
        handleOverlayMouseDown={handleOverlayMouseDown}
        handleOverlayMouseMove={handleOverlayMouseMove}
        handleOverlayMouseUp={handleOverlayMouseUp}
      />
    );
  },
);

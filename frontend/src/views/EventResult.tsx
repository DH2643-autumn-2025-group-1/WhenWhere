import { useState } from "react";
import styled from "styled-components";
import TextBoxWithActions from "../components/TextBoxWithActions";
import Calendar from "../components/Calendar";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.large};
  margin: ${(props) => props.theme.spacing.large};

  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
  }
`;

const Panel = styled.div`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  padding: ${(props) => props.theme.spacing.large};
  width: 100%;
  max-width: 600px;
  gap: ${(props) => props.theme.spacing.medium};
`;

const CalendarWrapper = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
`;

export interface EventResultViewProps {
  readonly eventTitle: string;
  readonly shareUrl?: string;
  readonly event?: {
    availability?: { userId: string; username?: string; availableSlots: Date[] | string[] }[];
  } | null;
  readonly currentUserId?: string | null;
}

export function EventResultView({
  eventTitle,
  shareUrl,
  event,
  currentUserId,
}: EventResultViewProps) {
  const [weekAnchor, setWeekAnchor] = useState(() => new Date());

  return (
    <Container>
      <Panel>
        <h2 style={{ margin: 0 }}>Results for: {eventTitle}</h2>
        {shareUrl && (
          <TextBoxWithActions title="Shareable voting link" value={shareUrl} />
        )}
        <div>
          <CalendarWrapper>
            <Calendar
              key={`${JSON.stringify(event?.availability || [])}-${weekAnchor.getTime()}`}
              weekAnchor={weekAnchor}
              onNavigateWeek={(next) => setWeekAnchor(next)}
              heatmapData={event?.availability}
              currentUserId={currentUserId}
            />
          </CalendarWrapper>
        </div>
      </Panel>
    </Container>
  );
}

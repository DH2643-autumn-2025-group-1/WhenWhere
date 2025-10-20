import { CircularProgress } from "@mui/material";
import styled from "styled-components";
import EventIcon from "@mui/icons-material/Event";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import GroupIcon from "@mui/icons-material/Group";
import { useState } from "react";
import AlertDialog from "../components/Dialog";
import type { Event } from "../models/EventModel";
import { ButtonComponent } from "../components/Button";
import {
  PageWrapper,
  Container,
  Card,
  CardHeader,
  IconWrapper,
  Title,
  StyledRemoveIcon,
} from "../components/StyledComponents";

export function HomePage({
  myEvents,
  friendsEvents,
  deleteEvent,
  onSelectEvent,
  onCreateEvent,
}: {
  myEvents: Array<Event>;
  friendsEvents: Array<Event>;
  deleteEvent: (id: string) => void;
  onSelectEvent: (event: Event) => void;
  onCreateEvent: () => void;
}) {
  const [indexOpenWarningDialog, setIndexOpenWarningDialog] = useState<
    string | null
  >(null);

  return (
    <PageWrapper>
      <Container>
        <Card>
          <CardHeader>
            <IconWrapper>
              <EventIcon />
            </IconWrapper>
            <Title>My Events</Title>
          </CardHeader>
          {!myEvents ? (
            <LoadingWrapper>
              <CircularProgress />
            </LoadingWrapper>
          ) : (
            <EventList>
              {myEvents.length > 0 ? (
                myEvents.map((event, index) => (
                  <EventContainer key={index}>
                    {indexOpenWarningDialog && (
                      <AlertDialog
                        open={indexOpenWarningDialog === event._id}
                        setOpen={(open) =>
                          setIndexOpenWarningDialog(open ? event._id : null)
                        }
                        onAgree={() => deleteEvent(event._id)}
                        title={"Remove event?"}
                        description={
                          event.title
                            ? `Are you sure you want to remove "${event.title}"? This action cannot be undone.`
                            : `Are you sure you want to remove this event? This action cannot be undone.`
                        }
                      />
                    )}
                    <StyledRemoveIcon
                      onClick={() => setIndexOpenWarningDialog(event._id)}
                    />
                    <EventItem onClick={() => onSelectEvent(event)}>
                      <EventIcon fontSize="small" />
                      <EventTitle>{event.title}</EventTitle>
                    </EventItem>
                  </EventContainer>
                ))
              ) : (
                <EmptyState>
                  <EmptyStateIcon>
                    <AddCircleOutlineIcon fontSize="large" />
                  </EmptyStateIcon>
                  <NoEventsText>No events created yet</NoEventsText>
                  <EmptyStateSubtext>
                    Create your first event to get started
                  </EmptyStateSubtext>
                </EmptyState>
              )}
            </EventList>
          )}
          <ButtonComponent
            variant="primary"
            disabled={!myEvents}
            text="Create event"
            onClickFunction={onCreateEvent}
            fullwidth={true}
          />
        </Card>
        <Card>
          <CardHeader>
            <IconWrapper>
              <GroupIcon />
            </IconWrapper>
            <Title>Friends' Events</Title>
          </CardHeader>
          {!friendsEvents ? (
            <LoadingWrapper>
              <CircularProgress />
            </LoadingWrapper>
          ) : (
            <EventList>
              {friendsEvents.length > 0 ? (
                friendsEvents.map((event, index) => (
                  <EventItem key={index} onClick={() => onSelectEvent(event)}>
                    <EventIcon fontSize="small" />
                    <EventTitle>{event.title}</EventTitle>
                  </EventItem>
                ))
              ) : (
                <EmptyState>
                  <EmptyStateIcon>
                    <GroupIcon fontSize="large" />
                  </EmptyStateIcon>
                  <NoEventsText>No friends' events available</NoEventsText>
                  <EmptyStateSubtext>
                    Events shared by friends will appear here
                  </EmptyStateSubtext>
                </EmptyState>
              )}
            </EventList>
          )}
        </Card>
      </Container>
    </PageWrapper>
  );
}

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${(props) => props.theme.spacing.xlarge};
`;

const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.medium};
  width: 100%;
  flex-grow: 1;
  overflow-y: auto;
  max-height: 400px;
`;

const EventContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${(props) => props.theme.spacing.small};
`;

const EventItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.medium};
  border: 2px solid #e8ecf1;
  border-radius: 12px;
  width: 100%;
  cursor: pointer;
  text-transform: capitalize;
  padding: ${(props) => props.theme.spacing.medium};
  color: ${(props) => props.theme.colors.primary};
  background: white;
  transition: all 0.2s ease;
  font-weight: 500;

  &&:hover {
    background: linear-gradient(
      135deg,
      ${(props) => props.theme.colors.secondary},
      #e3f2fd
    );
    border-color: ${(props) => props.theme.colors.primary};
    transform: translateX(0px);
  }

  &&:active {
    transform: scale(0.98);
  }
`;

const EventTitle = styled.span`
  flex: 1;
  text-align: left;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.xlarge};
  gap: ${(props) => props.theme.spacing.medium};
  min-height: 200px;
`;

const EmptyStateIcon = styled.div`
  color: ${(props) => props.theme.colors.primary};
  opacity: 0.6;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.secondary};
`;

const NoEventsText = styled.span`
  color: #7f8c8d;
  text-align: center;
  font-size: ${(props) => props.theme.fontSizes.large};
  font-weight: 500;
`;

const EmptyStateSubtext = styled.span`
  color: #95a5a6;
  text-align: center;
  font-size: ${(props) => props.theme.fontSizes.medium};
`;

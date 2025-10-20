import { CircularProgress } from "@mui/material";
import styled from "styled-components";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import EventIcon from "@mui/icons-material/Event";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import GroupIcon from "@mui/icons-material/Group";
import { useState } from "react";
import AlertDialog from "../components/Dialog";
import type { Event } from "../models/EventModel";
import { ButtonComponent } from "../components/Button";

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

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  padding-bottom: ${(props) => props.theme.spacing.xlarge};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xlarge};
  margin: 0 ${(props) => props.theme.spacing.large};
  padding-top: ${(props) => props.theme.spacing.xlarge};
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;

  @media (min-width: ${(props) => props.theme.breakpoints.mobile}) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
  }
`;

const Card = styled.div`
  border: none;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  background: white;
  width: 95%;
  padding: ${(props) => props.theme.spacing.xlarge};
  gap: ${(props) => props.theme.spacing.large};
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  }

  @media (min-width: ${(props) => props.theme.breakpoints.desktop}) {
    width: 500px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.medium};
  padding-bottom: ${(props) => props.theme.spacing.medium};
  border-bottom: 2px solid ${(props) => props.theme.colors.secondary};
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary},
    #357abd
  );
  color: white;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
`;

const Title = styled.h2`
  font-size: ${(props) => props.theme.fontSizes.xlarge};
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
`;

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

const StyledRemoveIcon = styled(RemoveCircleOutlineIcon)`
  cursor: pointer;
  color: #f2a097;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &&:hover {
    color: ${(props) => props.theme.colors.danger};
    transform: scale(1.1);
  }
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

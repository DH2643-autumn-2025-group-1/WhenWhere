import { CircularProgress } from "@mui/material";
import styled from "styled-components";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useNavigate } from "react-router";
import { useState } from "react";
import AlertDialog from "../components/Dialog";
import type { Event } from "../models/EventModel";
import { ButtonComponent } from "../components/Button";
import { makeResultPath } from "../utils/shareHash";

export function HomePage({
  myEvents,
  friendsEvents,
  deleteEvent,
  onSelectEvent,
}: {
  myEvents: Array<Event>;
  friendsEvents: Array<Event>;
  deleteEvent: (id: string) => void;
  onSelectEvent: (event: Event) => void;
}) {
  const navigate = useNavigate();
  const [openWarningDialog, setOpenWarningDialog] = useState(false);

  return (
    <Container>
      <Card>
        <Title>My Events:</Title>
        {!myEvents ? (
          <CircularProgress />
        ) : (
          <EventList>
            {myEvents.length > 0 ? (
              myEvents.map((event, index) => (
                <EventContainer key={index}>
                  {openWarningDialog && (
                    <AlertDialog
                      open={openWarningDialog}
                      setOpen={setOpenWarningDialog}
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
                    onClick={() => setOpenWarningDialog(true)}
                  />
                  <Event
                    onClick={() => navigate(makeResultPath(event.shareHash))}
                  >
                    {event.title}
                  </Event>
                </EventContainer>
              ))
            ) : (
              <NoEventsText>No events created yet</NoEventsText>
            )}
          </EventList>
        )}
        <ButtonComponent
          variant="primary"
          disabled={!myEvents}
          text="Create event"
          onClickFunction={() => navigate("create-event")}
        />
      </Card>
      <Card>
        <Title>Friends' Events</Title>
        {!friendsEvents ? (
          <CircularProgress />
        ) : (
          <EventList>
            {friendsEvents.length > 0 ? (
              friendsEvents.map((event, index) => (
                <Event
                  key={index}
                  onClick={() => navigate(makeResultPath(event.shareHash))}
                >
                  {event.title}
                </Event>
              ))
            ) : (
              <NoEventsText>No friends' events available</NoEventsText>
            )}
          </EventList>
        )}
      </Card>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.spacing.large};
  margin: ${(props) => props.theme.spacing.xlarge};

  @media (min-width: ${(props) => props.theme.breakpoints.mobile}) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
  }
`;

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  width: 95%;
  padding: ${(props) => props.theme.spacing.large};
  gap: ${(props) => props.theme.spacing.large};

  @media (min-width: ${(props) => props.theme.breakpoints.desktop}) {
    width: 450px;
  }
`;

const Title = styled.h2`
  all: unset;
  font-size: ${(props) => props.theme.fontSizes.xlarge};
  text-decoration: underline;
`;

const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.medium};
  width: 100%;
  flex-grow: 1;
  overflow-y: auto;
`;

const EventContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${(props) => props.theme.spacing.small};
`;

const Event = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 100%;
  text-align: center;
  cursor: pointer;
  text-transform: capitalize;
  padding: ${(props) => props.theme.spacing.small};
  color: ${(props) => props.theme.colors.primary};
  position: relative;

  &&:hover {
    text-decoration: underline;
    background-color: #f9f9f9;
  }
`;

const StyledRemoveIcon = styled(RemoveCircleOutlineIcon)`
  cursor: pointer;
  color: #f2a097;

  &&:hover {
    color: ${(props) => props.theme.colors.danger};
  }
`;

const NoEventsText = styled.span`
  color: #888;
  text-align: center;
`;

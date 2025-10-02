import { Button } from "@mui/material";
import styled from "styled-components";

export function HomePage() {
  // TODO remove when model exists
  const myEvents = ["lunch meeting", "project plan discussion"];
  const friendsEvents = ["dinner with friends", "gym session"];

  return (
    <Container>
      <Card>
        <Title>My Events:</Title>
        <EventList>
          {myEvents.length > 0 ? (
            myEvents.map((event, index) => <Event key={index}>{event}</Event>)
          ) : (
            <NoEventsText>No events created yet</NoEventsText>
          )}
        </EventList>
        <StyledButton
          variant="outlined"
          fullWidth
          onClick={() => console.log("not implemented")}
        >
          Create event
        </StyledButton>
      </Card>
      <Card>
        <Title>Friends' Events</Title>
        <EventList>
          {friendsEvents.length > 0 ? (
            friendsEvents.map((event, index) => (
              <Event key={index}>{event}</Event>
            ))
          ) : (
            <NoEventsText>No friends' events available</NoEventsText>
          )}
        </EventList>
      </Card>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.large};
  margin: ${(props) => props.theme.spacing.xlarge};
`;

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  width: 450px;
  height: 550px;
  padding: ${(props) => props.theme.spacing.large};
  gap: ${(props) => props.theme.spacing.medium};
`;

const Title = styled.h2`
  all: unset;
  font-size: ${(props) => props.theme.fontSizes.xlarge};
  text-decoration: underline;
  margin-bottom: ${(props) => props.theme.spacing.small};
`;

const StyledButton = styled(Button)`
  background-color: ${(props) => props.theme.colors.primary};
  color: #fff;

  &&:hover {
    background-color: #73a9e8;
  }
`;

const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.medium};
  width: 100%;
  flex-grow: 1;
  overflow-y: auto;
`;

const Event = styled(Button)`
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 100%;
  text-align: center;
  cursor: pointer;
  text-transform: capitalize;
  color: ${(props) => props.theme.colors.primary};

  &&:hover {
    background-color: ${(props) => props.theme.colors.secondary};
  }
`;

const NoEventsText = styled.span`
  color: #888;
  font-style: italic;
  text-align: center;
`;

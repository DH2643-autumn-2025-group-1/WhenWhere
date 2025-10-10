import styled from "styled-components";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { theme } from "../styles/theme";
import { VoteLocation } from "./VoteLocation";
import type { EventPlace } from "../models/EventModel";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: ${(props) => props.theme.spacing.xlarge};
  gap: 96px;
`;

const EventResultComponent = styled.div`
  gap: ${(props) => props.theme.spacing.xlarge};
  display: flex;
  flex-direction: column;
  width: 100%;

  @media (min-width: ${(props) => props.theme.breakpoints.mobile}) {
    width: 550px;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
    width: 700px;
  }
`;

const WinningCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 52px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  color: #222;
`;

const WinnerCard = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fffbe6, #fff8e1);
  border: 2px solid #ffd700;
  border-radius: 20px;
  padding: ${(props) => props.theme.spacing.medium};
  box-shadow: 0 3px 8px rgba(255, 215, 0, 0.25);
  gap: ${(props) => props.theme.spacing.small};

  svg {
    color: #ffd700;
    font-size: 32px;
  }
`;

const WinnerText = styled.h2`
  all: unset;
  font-size: 20px;
  font-weight: 600;
  color: #333;
`;

const TimeContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TimeSlotContainer = styled.div<{ rank?: number }>`
  padding: ${(props) => props.theme.spacing.medium};
  border-bottom: 1px solid #eee;
  display: grid;
  grid-template-columns: 1fr 4fr 4fr;
  align-items: center;
  gap: ${(props) => props.theme.spacing.medium};
  border-radius: 16px;
  margin: 4px 0;

  background: ${({ rank }) =>
    rank === 0
      ? "linear-gradient(135deg, #fff9db, #fffbe6)"
      : rank === 1
        ? "linear-gradient(135deg, #f3f4f6, #e9ebef)"
        : rank === 2
          ? "linear-gradient(135deg, #fff2e0, #fff8e6)"
          : "white"};

  border: ${({ rank }) =>
    rank === 0
      ? "2px solid #FFD700"
      : rank === 1
        ? "2px solid #B0BEC5"
        : rank === 2
          ? "2px solid #CD7F32"
          : "2px solid #ddd"};

  box-shadow: ${({ rank }) =>
    rank === 0
      ? "0 2px 8px rgba(255, 215, 0, 0.25)"
      : rank === 1
        ? "0 2px 8px rgba(176, 190, 197, 0.25)"
        : rank === 2
          ? "0 2px 8px rgba(205, 127, 50, 0.25)"
          : "0 2px 8px #ddd"};
`;

const TimeSlot = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 18px;
  font-weight: 500;
  color: #333;
`;

const DateText = styled.span`
  font-weight: 600;
  color: #222;
`;

const TimeText = styled.span`
  color: #555;
  font-size: 16px;
  margin-top: 2px;
`;

const NoTimeSlotsText = styled.div`
  text-align: center;
  color: #888;
  font-size: 18px;
  padding: ${(props) => props.theme.spacing.medium};
`;

const People = styled.span`
  font-size: 14px;
  color: #777;
  display: flex;
  gap: ${(props) => props.theme.spacing.small};
`;

const PeopleNumber = styled.span`
  font-weight: 600;
  color: #555;
  font-size: 15px;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    width: 100%;
    text-align: right;
  }
`;

const SubTitleText = styled.h3`
  all: unset;
  flex-grow: 1;
  white-space: nowrap;
  text-align: center;
  display: flex;
  justify-content: center;
  text-transform: uppercase;
  font-weight: 600;
`;

export function EventResult({
  peopleVoted,
  winningSlots,
  topLocation,
  places,
}: {
  peopleVoted: string[][];
  winningSlots: string[];
  topLocation: string | null;
  places: EventPlace[];
}) {
  const trophyColors = ["#FFD700", "#B0BEC5", "#CD7F32"];

  return (
    <Container>
      <EventResultComponent>
        <Title>Event Result:</Title>
        <WinningCardsContainer>
          <div>
            <SubTitleWithLines>Most voted location:</SubTitleWithLines>
            {topLocation && (
              <WinnerCard>
                <EmojiEventsIcon />
                <WinnerText>{topLocation}</WinnerText>
              </WinnerCard>
            )}
          </div>
          <div>
            <SubTitleWithLines>Most voted times:</SubTitleWithLines>
            <TimeContainer>
              {winningSlots.map((slot, index) => {
                const color =
                  index < 3 ? trophyColors[index] : "rgba(0, 0, 0, 0.3)";

                return (
                  <TimeSlotContainer key={slot} rank={index}>
                    <EmojiEventsIcon
                      style={{
                        color,
                        fontSize: 26,
                      }}
                    />
                    <TimeSlot>
                      <DateText>
                        {slot.split(" ").slice(0, 3).join(" ")}
                      </DateText>
                      <TimeText>{slot.split(" ").slice(3).join(" ")}</TimeText>
                    </TimeSlot>
                    <People>
                      <PeopleNumber>({peopleVoted[index].length})</PeopleNumber>
                      {screen.width >
                        Number(theme.breakpoints.mobile.replace("px", "")) &&
                        peopleVoted[index].join(", ")}
                    </People>
                  </TimeSlotContainer>
                );
              })}

              {winningSlots.length === 0 && (
                <NoTimeSlotsText>No winning time slots yet.</NoTimeSlotsText>
              )}
            </TimeContainer>
          </div>
        </WinningCardsContainer>
      </EventResultComponent>
      <VoteLocation
        places={places}
        setHaveVotedLocation={() => {}}
        isvoting={false}
      />
    </Container>
  );
}

const SubTitleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  gap: ${(props) => props.theme.spacing.medium};
  margin-bottom: ${(props) => props.theme.spacing.medium};
`;

const SubTitleLine = styled.div`
  flex-grow: 1;
  height: 1px;
  background-color: #111;
  width: 100%;
`;

function SubTitleWithLines({ children }: { children: React.ReactNode }) {
  return (
    <SubTitleContainer>
      <SubTitleLine />
      <SubTitleText>{children}</SubTitleText>
      <SubTitleLine />
    </SubTitleContainer>
  );
}

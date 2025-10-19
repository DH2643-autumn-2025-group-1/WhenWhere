import styled from "styled-components";
import { ButtonComponent } from "../components/Button";
import { type ReactNode } from "react";
import { useNavigate } from "react-router";
import TextBoxWithActions from "../components/TextBoxWithActions";
import { Card } from "../components/StyledComponents";
import EventIcon from "@mui/icons-material/Event";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.large};
  gap: ${(props) => props.theme.spacing.large};
  width: 100%;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.large};
  width: 100%;

  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
    flex-direction: row;
  }
`;

const LinkAndLocationContainer = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.large};
  flex-direction: column-reverse;

  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  color: #222;
`;

const PlaceAndSubmitContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${(props) => props.theme.spacing.large};
  width: 100%;

  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
    width: 40%;
  }
`;

const EventDetailsCard = styled(Card)`
  width: 100%;
  gap: ${(props) => props.theme.spacing.small};
`;

const EventTitle = styled.h3`
  font-size: ${(props) => props.theme.fontSizes.large};
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.small};
`;

const EventDescription = styled.p`
  font-size: ${(props) => props.theme.fontSizes.medium};
  color: #7f8c8d;
  margin: 0;
  line-height: 1.5;
`;

function VoteTimeAndPlace({
  resultsPath = "/event-result",
  onSubmit,
  shareUrl,
  availabilitySlot,
  locationSlot,
  submitDisabled,
  eventTitle,
  eventDescription,
}: {
  resultsPath?: string;
  onSubmit?: () => void;
  shareUrl?: string;
  availabilitySlot: ReactNode;
  locationSlot: ReactNode;
  submitDisabled?: boolean;
  eventTitle: string;
  eventDescription?: string;
}) {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>Vote for When and Where "{eventTitle}" will be:</Title>
      <ContentContainer>
        {availabilitySlot}
        <PlaceAndSubmitContainer>
          <LinkAndLocationContainer>
            {shareUrl && (
              <TextBoxWithActions
                title="Share the vote with:"
                value={shareUrl}
              />
            )}
            {locationSlot}
          </LinkAndLocationContainer>
          <EventDetailsCard>
            <EventTitle>
              <EventIcon fontSize="small" />
              {eventTitle}
            </EventTitle>
            {eventDescription && (
              <EventDescription>{eventDescription}</EventDescription>
            )}
          </EventDetailsCard>
          <ButtonComponent
            onClickFunction={onSubmit ? onSubmit : () => navigate(resultsPath)}
            text="Submit and see results"
            disabled={submitDisabled}
            variant="primary"
          />
        </PlaceAndSubmitContainer>
      </ContentContainer>
    </Container>
  );
}

export default VoteTimeAndPlace;

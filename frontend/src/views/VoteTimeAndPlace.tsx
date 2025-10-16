import styled from "styled-components";
import { ButtonComponent } from "../components/Button";
import { type ReactNode } from "react";
import { useNavigate } from "react-router";
import TextBoxWithActions from "../components/TextBoxWithActions";

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

function VoteTimeAndPlace({
  resultsPath = "/event-result",
  onSubmit,
  shareUrl,
  availabilitySlot,
  locationSlot,
  submitDisabled,
}: {
  resultsPath?: string;
  onSubmit?: () => void;
  shareUrl?: string;
  availabilitySlot: ReactNode;
  locationSlot: ReactNode;
  submitDisabled?: boolean;
}) {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>Vote for your preferred times and location</Title>
      <ContentContainer>
        {availabilitySlot}
        <PlaceAndSubmitContainer>
          <LinkAndLocationContainer>
            {shareUrl && (
              <TextBoxWithActions
                title="Shareable voting link"
                value={shareUrl}
              />
            )}
            {locationSlot}
          </LinkAndLocationContainer>
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

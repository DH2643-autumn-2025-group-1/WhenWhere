import styled from "styled-components";
import { ButtonComponent } from "../components/Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AvailabilityPresenter } from "../presenters/AvailabilityPresenter";
import { VoteLocationPresenter } from "../presenters/VoteLocationPresenter";
import type { EventLocation } from "../models/EventModel";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.spacing.large};
  padding: ${(props) => props.theme.spacing.large};
  width: 100%;

  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
  }
`;

const PlaceAndSubmitContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${(props) => props.theme.spacing.large};
  width: 100%;

  > * {
    width: 100%;
  }
`;

function VoteTimeAndPlace({
  places,
  resultsPath = "/event-result",
  onSelectedDatesChange,
  onSubmit,
}: {
  places: EventLocation[] | undefined;
  resultsPath?: string;
  onSelectedDatesChange?: (dates: Date[]) => void;
  onSubmit?: () => void;
}) {
  const [haveVotedLocation, setHaveVotedLocation] = useState(false);
  const [haveVotedTime, setHaveVotedTime] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!places || places.length === 0) {
      setHaveVotedLocation(true);
    }
  }, [setHaveVotedLocation, places]);

  return (
    <Container>
      <AvailabilityPresenter
        setHaveVotedTime={setHaveVotedTime}
        onSelectedChange={onSelectedDatesChange}
      />
      <PlaceAndSubmitContainer>
        <VoteLocationPresenter
          setHaveVotedLocation={setHaveVotedLocation}
          places={places || []}
        />
        <ButtonComponent
          onClickFunction={onSubmit ? onSubmit : () => navigate(resultsPath)}
          text="Submit and see results"
          disabled={!haveVotedLocation || !haveVotedTime}
          variant="primary"
        />
      </PlaceAndSubmitContainer>
    </Container>
  );
}

export default VoteTimeAndPlace;

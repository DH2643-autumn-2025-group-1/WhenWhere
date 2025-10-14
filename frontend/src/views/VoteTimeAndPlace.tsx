import styled from "styled-components";
import { ButtonComponent } from "../components/Button";
import { useEffect } from "react";
import { AvailabilityPresenter } from "../presenters/AvailabilityPresenter";
import { VoteLocationPresenter } from "../presenters/VoteLocationPresenter";
// View-only: no data fetching/saving here

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.spacing.large};
  margin: ${(props) => props.theme.spacing.large};

  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
  }
`;

const PlaceAndSubmitContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: spac;
  gap: ${(props) => props.theme.spacing.large};
`;

function VoteTimeAndPlace({
  places,
  haveVotedLocation,
  setHaveVotedLocation,
  haveVotedTime,
  setHaveVotedTime,
  onSelectedDatesChange,
  isSaving,
  error,
  onSubmit,
}: {
  places: string[] | undefined;
  haveVotedLocation: boolean;
  setHaveVotedLocation: (v: boolean) => void;
  haveVotedTime: boolean;
  setHaveVotedTime: (v: boolean) => void;
  onSelectedDatesChange: (dates: Date[]) => void;
  isSaving: boolean;
  error: string | null;
  onSubmit: () => void;
}) {
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
        {error && (
          <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
        )}
        <ButtonComponent
          onClickFunction={onSubmit}
          text={isSaving ? "Saving..." : "Submit and see results"}
          disabled={!haveVotedLocation || !haveVotedTime || isSaving}
          variant="primary"
        />
      </PlaceAndSubmitContainer>
    </Container>
  );
}

export default VoteTimeAndPlace;

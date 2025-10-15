import { useState } from "react";
import styled from "styled-components";
import type { Place } from "../models/EventModel";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.xlarge};
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: ${(props) => props.theme.spacing.large};
  width: 100%;

  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
    width: 300px;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.desktop}) {
    width: 400px;
  }
`;

const Title = styled.h2`
  all: unset;
  font-size: ${(props) => props.theme.fontSizes.large};
  text-align: center;
`;

const NoPlacesText = styled.p`
  text-align: center;
  color: #888;
`;

const PlacesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.medium};
`;

const PlaceItem = styled.div<{ $active: boolean }>`
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: ${(props) =>
    props.$active ? props.theme.colors.primary : props.theme.colors.secondary};
  color: ${(props) => (props.$active ? "white" : "black")};
  flex-wrap: wrap;
  text-align: center;

  &&:hover {
    background-color: ${(props) => !props.$active && `#b7d3f3`};
    cursor: pointer;
  }
`;

export function VoteLocation({
  places,
  setHaveVotedLocation,
  onLocationChange,
}: {
  places?: Place[];
  setHaveVotedLocation: (voted: boolean) => void;
  onLocationChange?: (location: Place | null) => void;
}) {
  const [chosenPlace, setChosenPlace] = useState<Place | null>(null);

  function handlePlaceSelection(place: Place) {
    setChosenPlace(place);
    setHaveVotedLocation(true);
    onLocationChange?.(place);
  }

  return (
    <Container>
      <Title>Vote for location:</Title>
      {!places || places?.length === 0 ? (
        <NoPlacesText>No places to vote for.</NoPlacesText>
      ) : (
        <PlacesList>
          {places?.map((place: Place, index) => (
            <PlaceItem
              key={index}
              $active={place?.name === chosenPlace?.name}
              onClick={() => handlePlaceSelection(place)}
            >
              {place?.name}
            </PlaceItem>
          ))}
        </PlacesList>
      )}
    </Container>
  );
}

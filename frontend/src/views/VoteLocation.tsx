import { useState } from "react";
import styled, { css } from "styled-components";
import { theme } from "../styles/theme";
import { darken, lighten } from "polished";

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

const PlaceItem = styled.div<{
  $active: boolean;
  $isvoting: boolean;
  colorStrength: number;
}>`
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: ${(props) => getBackgroundColor(props)};
  flex-wrap: wrap;
  text-align: center;

  & > *::first-letter {
    text-transform: uppercase;
  }

  ${({ $isvoting, $active }) =>
    $isvoting &&
    css`
      &&:hover {
        background-color: ${!$active ? "#b7d3f3" : undefined};
        cursor: pointer;
      }
    `}
`;

export function VoteLocation({
  places,
  setHaveVotedLocation,
  isvoting,
  onLocationChange,
}: {
  places?: { place: string; votes: string[] }[];
  setHaveVotedLocation: (voted: boolean) => void;
  isvoting: boolean;
  onLocationChange?: (location: string | null) => void;
}) {
  const [chosenPlace, setChosenPlace] = useState<string | null>(null);

  function handlePlaceSelection(place: string) {
    setChosenPlace(place);
    setHaveVotedLocation(true);
    onLocationChange?.(place);
  }

  return (
    <Container>
      <Title>
        {isvoting
          ? `Vote for location:`
          : `Distribution of votes for location:`}
      </Title>
      {!places || places?.length === 0 ? (
        <NoPlacesText>No places to vote for.</NoPlacesText>
      ) : (
        <PlacesList>
          {places?.map((place, index) => (
            <PlaceItem
              key={index}
              $active={place.place === chosenPlace}
              onClick={() => isvoting && handlePlaceSelection(place.place)}
              $isvoting={isvoting}
              colorStrength={place.votes.length}
            >
              {place.place.charAt(0).toUpperCase() + place.place.slice(1)}
              {!isvoting &&
                ` ― ${place.votes.length} vote${place.votes.length === 1 ? "" : "s"}`}
            </PlaceItem>
          ))}
        </PlacesList>
      )}
    </Container>
  );
}

const getBackgroundColor = ({
  $active,
  $isvoting,
  colorStrength,
}: {
  $active: boolean;
  $isvoting: boolean;
  colorStrength: number;
}) => {
  const baseColor = $active ? theme.colors.primary : theme.colors.secondary;

  if ($isvoting) return baseColor;

  const intensity = (colorStrength / 5) * 3;
  return darken(intensity * 0.1, lighten(0.05, baseColor));
};

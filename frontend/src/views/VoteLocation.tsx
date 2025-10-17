import { useState } from "react";
import styled, { css } from "styled-components";
import { theme } from "../styles/theme";
import { darken, lighten } from "polished";
import type { Place } from "../models/EventModel";

const Container = styled.div<{ $isvoting?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.xlarge};
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: ${(props) => props.theme.spacing.large};
  width: 100%;
`;

const Title = styled.h2<{ $isvoting?: boolean }>`
  all: unset;
  font-size: ${(props) => props.theme.fontSizes.large};
  text-align: center;
  ${(props) =>
    !props.$isvoting &&
    css`
      font-weight: 600;
    `}
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
  $colorstrength: number;
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
  isvoting,
  onLocationChange,
}: {
  places?: Place[];
  setHaveVotedLocation?: (voted: boolean) => void;
  onLocationChange?: (location: Place) => void;
  isvoting: boolean;
}) {
  const [chosenPlace, setChosenPlace] = useState<string | null>(null);

  if (!isvoting && (!places || places.length === 0)) {
    return null;
  }

  function handlePlaceSelection(place: Place) {
    setChosenPlace(place.name);
    onLocationChange?.(place);
  }

  return (
    <Container $isvoting={isvoting}>
      <Title $isvoting={isvoting}>
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
              $active={place.name === chosenPlace}
              onClick={() => {
                if (isvoting) handlePlaceSelection(place);
              }}
              $isvoting={isvoting}
              $colorstrength={place.votes.length}
            >
              {place?.name.charAt(0).toUpperCase() +
                place?.name.slice(1) +
                ", " +
                place.formatted_address}
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
  $colorstrength,
}: {
  $active: boolean;
  $isvoting: boolean;
  $colorstrength: number;
}) => {
  const baseColor = $active ? theme.colors.primary : theme.colors.secondary;

  if ($isvoting) return baseColor;

  const intensity = ($colorstrength / 5) * 3;
  return darken(intensity * 0.1, lighten(0.05, baseColor));
};

import { useState, useEffect, useRef } from "react";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";

const API_KEY = import.meta.env.VITE_REACT_GOOGLE_PLACES_API_KEY;

export function Location() {
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  console.log("Selected place:", selectedPlace); // TODO remove

  return (
    <APIProvider
      apiKey={API_KEY}
      solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
      libraries={["places"]}
    >
      <div className="autocomplete-control">
        <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
      </div>
    </APIProvider>
  );
}

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

const PlaceAutocomplete = ({ onPlaceSelect }: PlaceAutocompleteProps) => {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "formatted_address"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className="autocomplete-container">
      <input ref={inputRef} />
    </div>
  );
};

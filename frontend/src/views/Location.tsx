import { useState, useEffect, useRef } from "react";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { TextField } from "@mui/material";

const API_KEY = import.meta.env.VITE_REACT_GOOGLE_PLACES_API_KEY;

export function Location({
  value,
  label,
  onSelectFuntion,
}: {
  value: string;
  label: string;
  onSelectFuntion?: (value: google.maps.places.PlaceResult | null) => void;
}) {
  return (
    <APIProvider
      apiKey={API_KEY}
      solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
      libraries={["places"]}
    >
      <div className="autocomplete-control" style={{ width: "100%" }}>
        <PlaceAutocomplete
          onPlaceSelect={onSelectFuntion}
          label={label}
          defaultValue={value}
        />
      </div>
    </APIProvider>
  );
}

interface PlaceAutocompleteProps {
  onPlaceSelect?: (place: google.maps.places.PlaceResult | null) => void;
  label: string;
  defaultValue?: string;
}

const PlaceAutocomplete = ({
  defaultValue,
  onPlaceSelect,
  label,
}: PlaceAutocompleteProps) => {
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
      if (onPlaceSelect) onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className="autocomplete-container">
      <TextField
        inputRef={inputRef}
        label={label}
        variant="outlined"
        fullWidth
        margin="normal"
        defaultValue={defaultValue}
      />
    </div>
  );
};

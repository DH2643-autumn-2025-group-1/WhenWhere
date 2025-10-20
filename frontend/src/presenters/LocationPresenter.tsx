import { useEffect, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import type { Place } from "../models/EventModel";
import { LocationView } from "../views/Location";

export function LocationPresenter({
  value,
  label,
  onSelectFuntion,
}: {
  value: Place;
  label: string;
  onSelectFuntion: (value: Place | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!places || !inputRef.current) return;
    const options = { fields: ["geometry", "name", "formatted_address"] };
    setAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!autocomplete) return;
    const listener = autocomplete.addListener("place_changed", () => {
      const gPlace = autocomplete.getPlace();
      if (!gPlace || !gPlace.name) {
        const customPlaceName = inputRef.current?.value?.trim();
        if (customPlaceName) {
          const customPlace: Place = {
            name: customPlaceName,
            html_attributions: [],
            votes: [],
          };
          onSelectFuntion(customPlace);
        } else {
          onSelectFuntion(null);
        }
        return;
      }

      const mappedPlace: Place = {
        name: gPlace.name,
        formatted_address: gPlace.formatted_address,
        geometry: gPlace.geometry
          ? {
              location: {
                lat: gPlace.geometry.location?.lat(),
                lng: gPlace.geometry.location?.lng(),
              },
            }
          : undefined,
        html_attributions: [],
        votes: [],
      };
      onSelectFuntion(mappedPlace);
    });
    return () => listener.remove();
  }, [autocomplete, onSelectFuntion]);

  const handleBlur = () => {
    const inputValue = inputRef.current?.value?.trim();
    if (!inputValue) return;
    const customPlace: Place = {
      name: inputValue,
      html_attributions: [],
      votes: [],
    };
    onSelectFuntion(customPlace);
  };

  return (
    <div className="autocomplete-control" style={{ width: "100%" }}>
      <LocationView
        ref={inputRef}
        label={label}
        defaultValue={value?.name ?? ""}
        onBlur={handleBlur}
      />
    </div>
  );
}
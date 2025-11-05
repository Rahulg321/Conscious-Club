"use client";

import React, { useCallback, useRef, useEffect } from "react";
import {
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import { Input } from "./ui/input";

interface CityInputFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
}

const CityInputField = ({
  value = "",
  onChange,
  placeholder = "Enter city",
  id,
  className = "w-full",
}: CityInputFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  // Sync input value with prop value
  useEffect(() => {
    if (inputRef.current && value !== inputRef.current.value) {
      inputRef.current.value = value;
    }
  }, [value]);

  const onLoad = useCallback(
    (autocomplete: google.maps.places.Autocomplete) => {
      autocompleteRef.current = autocomplete;
    },
    []
  );

  const onPlaceChanged = useCallback(() => {
    if (autocompleteRef.current && inputRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place) {
        // Extract city name from the place result
        let cityName = "";
        
        // Try to get the city name from address_components
        const cityComponent = place.address_components?.find((component) =>
          component.types.includes("locality")
        );
        
        if (cityComponent) {
          cityName = cityComponent.long_name;
        } else {
          // Fallback to place name if city component not found
          cityName = place.name || "";
        }
        
        if (onChange && cityName) {
          onChange(cityName);
        }
        inputRef.current.value = cityName;
      }
    }
  }, [onChange]);

  if (!isLoaded) return <div>Loading...</div>;
  return (
    <div>
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          types: ["locality", "administrative_area_level_2"],
        }}
      >
        <Input
          id={id}
          ref={inputRef}
          placeholder={placeholder}
          className={className}
          defaultValue={value}
        />
      </Autocomplete>
    </div>
  );
};

export default CityInputField;


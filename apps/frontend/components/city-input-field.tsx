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

  // Check if Google Maps API key is available
  const hasApiKey = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

  const { isLoaded, loadError } = useJsApiLoader({
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

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (onChange) {
        onChange(newValue);
      }
      if (inputRef.current && inputRef.current.value !== newValue) {
        inputRef.current.value = newValue;
      }
    },
    [onChange]
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
        
        if (cityName) {
          handleValueChange(cityName);
        }
      }
    }
  }, [handleValueChange]);

  // Fallback: Manual input when API key is not available or fails to load
  if (!hasApiKey || loadError) {
    return (
      <div>
        <Input
          id={id}
          ref={inputRef}
          placeholder={placeholder}
          className={className}
          value={value}
          onChange={(event) => handleValueChange(event.target.value)}
        />
      </div>
    );
  }

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
          value={value}
          onChange={(event) => handleValueChange(event.target.value)}
        />
      </Autocomplete>
    </div>
  );
};

export default CityInputField;


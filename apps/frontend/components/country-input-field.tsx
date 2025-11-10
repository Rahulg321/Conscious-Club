"use client";

import React, { useCallback, useRef, useEffect } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { Input } from "./ui/input";

interface CountryInputFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
}

const CountryInputField = ({
  value = "",
  onChange,
  placeholder = "Enter country",
  id,
  className = "w-full",
}: CountryInputFieldProps) => {
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
        // Extract country name from the place result
        let countryName = "";

        // Try to get the country name from address_components
        const countryComponent = place.address_components?.find((component) =>
          component.types.includes("country")
        );

        if (countryComponent) {
          countryName = countryComponent.long_name;
        } else {
          // Fallback to place name if country component not found
          countryName = place.name || "";
        }

        if (countryName) {
          handleValueChange(countryName);
        }
      }
    }
  }, [handleValueChange]);

  if (!isLoaded) return <div>Loading...</div>;
  return (
    <div>
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          types: ["country"],
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

export default CountryInputField;

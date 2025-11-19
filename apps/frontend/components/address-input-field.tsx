"use client";

import React, { useCallback, useRef, useEffect } from "react";
import {
  useJsApiLoader,
  StandaloneSearchBox,
  Autocomplete,
} from "@react-google-maps/api";
import { Input } from "./ui/input";

interface AddressInputFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
}

const AddressInputField = ({
  value = "",
  onChange,
  placeholder = "Enter city, state, or country",
  id,
  className = "w-full",
}: AddressInputFieldProps) => {
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

  const onPlaceChanged = useCallback(() => {
    if (autocompleteRef.current && inputRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place) {
        const address = place.name || "";
        if (onChange && address) {
          onChange(address);
        }
        inputRef.current.value = address;
      }
    }
  }, [onChange]);

  // Fallback: Manual input when API key is not available or fails to load
  if (!hasApiKey || loadError) {
    return (
      <div>
        <Input
          id={id}
          ref={inputRef}
          placeholder={placeholder}
          className={className}
          defaultValue={value}
          onChange={(event) => {
            if (onChange) {
              onChange(event.target.value);
            }
          }}
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
          types: [
            "country",
            "locality",
            "administrative_area_level_1",
            "administrative_area_level_2",
          ],
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

export default AddressInputField;

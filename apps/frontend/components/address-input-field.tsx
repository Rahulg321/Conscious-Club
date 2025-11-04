"use client";

import React, { useCallback, useRef, useEffect } from "react";
import { useJsApiLoader, StandaloneSearchBox } from "@react-google-maps/api";
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
  placeholder = "Enter your address",
  id,
  className = "w-full",
}: AddressInputFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
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

  const onLoad = useCallback((searchBox: google.maps.places.SearchBox) => {
    searchBoxRef.current = searchBox;
  }, []);

  const onPlacesChanged = useCallback(() => {
    if (searchBoxRef.current && inputRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        if (place) {
          const address = place.formatted_address || place.name || "";
          if (onChange) {
            onChange(address);
          }
          inputRef.current.value = address;
        }
      }
    }
  }, [onChange]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
        <Input
          id={id}
          ref={inputRef}
          placeholder={placeholder}
          className={className}
          defaultValue={value}
        />
      </StandaloneSearchBox>
    </div>
  );
};

export default AddressInputField;

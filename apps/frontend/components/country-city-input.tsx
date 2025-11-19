"use client";

import React, { useCallback, useRef, useMemo, useEffect } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface CountryCityInputProps {
  countryValue?: string;
  cityValue?: string;
  onCountryChange?: (value: string) => void;
  onCityChange?: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
  label?: string;
}

const CountryCityInput = ({
  countryValue = "",
  cityValue = "",
  onCountryChange,
  onCityChange,
  placeholder = "Enter city and country (e.g., Paris, France)",
  id = "city-country",
  className = "w-full",
  label = "City & Country",
}: CountryCityInputProps) => {
  // Refs for the Google Autocomplete instance and input element
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if Google Maps API key is available
  const hasApiKey = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  // Compute the display value: "City, Country" format
  const displayValue = useMemo(() => {
    if (cityValue && countryValue) {
      return `${cityValue}, ${countryValue}`;
    }
    if (cityValue) {
      return cityValue;
    }
    if (countryValue) {
      return countryValue;
    }
    return "";
  }, [cityValue, countryValue]);

  // Sync the input value with our display value when props change
  useEffect(() => {
    if (inputRef.current && displayValue !== inputRef.current.value) {
      inputRef.current.value = displayValue;
    }
  }, [displayValue]);

  const onLoad = useCallback(
    (autocomplete: google.maps.places.Autocomplete) => {
      autocompleteRef.current = autocomplete;
    },
    []
  );

  // Handler for when user types in the input
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;

      // If user clears the input, clear both city and country
      if (!newValue) {
        if (onCityChange) {
          onCityChange("");
        }
        if (onCountryChange) {
          onCountryChange("");
        }
      }
      // Allow free-form typing for searching - don't update callbacks until place is selected
    },
    [onCityChange, onCountryChange]
  );

  // Handler for when a place is selected from autocomplete
  const onPlaceChanged = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.address_components) {
        // Extract city name
        let cityName = "";
        const cityComponent = place.address_components.find((component) =>
          component.types.includes("locality")
        );

        if (cityComponent) {
          cityName = cityComponent.long_name;
        } else {
          // Fallback: try administrative_area_level_1 (state/province) or use place name
          const adminComponent = place.address_components.find((component) =>
            component.types.includes("administrative_area_level_1")
          );
          if (adminComponent) {
            cityName = adminComponent.long_name;
          } else {
            cityName = place.name || "";
          }
        }

        // Extract country name
        let countryName = "";
        const countryComponent = place.address_components.find((component) =>
          component.types.includes("country")
        );

        if (countryComponent) {
          countryName = countryComponent.long_name;
        }

        // Update both city and country callbacks
        if (cityName && onCityChange) {
          onCityChange(cityName);
        }

        if (countryName && onCountryChange) {
          onCountryChange(countryName);
        }
      }
    }
  }, [onCityChange, onCountryChange]);

  // Fallback: Manual input when API key is not available or fails to load
  if (!hasApiKey || loadError || !isLoaded) {
    return (
      <div className="space-y-2 w-full">
        <Label htmlFor={id}>{label}</Label>
        <Input
          id={id}
          ref={inputRef}
          placeholder={placeholder}
          className={className}
          defaultValue={displayValue}
          onChange={(e) => {
            const value = e.target.value;
            // Try to parse "City, Country" format
            if (value.includes(",")) {
              const [city, country] = value.split(",").map(s => s.trim());
              if (city && onCityChange) onCityChange(city);
              if (country && onCountryChange) onCountryChange(country);
            } else {
              // If no comma, treat as city
              if (onCityChange) onCityChange(value);
            }
          }}
        />
        <p className="text-xs text-muted-foreground">
          {!hasApiKey
            ? "Enter city and country manually (e.g., Paris, France)"
            : loadError
            ? "Enter city and country manually (Google Maps unavailable)"
            : "Loading..."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 w-full">
      <Label htmlFor={id}>{label}</Label>
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          types: ["(cities)"], // Search for cities, which will include country info
        }}
      >
        <Input
          id={id}
          ref={inputRef}
          placeholder={placeholder}
          className={className}
          defaultValue={displayValue}
          onChange={handleInputChange}
        />
      </Autocomplete>
      <p className="text-xs text-muted-foreground">
        Type a city name (e.g., "Paris" or "Paris, France") and select from
        suggestions
      </p>
    </div>
  );
};

export default CountryCityInput;

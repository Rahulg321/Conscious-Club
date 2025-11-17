import * as React from "react";

export default function useMediaQuery(query: string) {
  // Start with undefined to avoid hydration mismatch
  // Server renders with undefined, client hydrates with actual value
  const [value, setValue] = React.useState<boolean | undefined>(undefined);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);

    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);

    result.addEventListener("change", onChange);
    setValue(result.matches);

    return () => result.removeEventListener("change", onChange);
  }, [query]);

  // Return false on server, actual value on client after hydration
  return value ?? false;
}

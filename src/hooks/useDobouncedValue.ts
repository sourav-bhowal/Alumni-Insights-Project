import { useEffect, useState } from "react";

export default function useDobouncedValue<T>(value: T, delay: number): T {
  // useDebouncedValue state
  const [debouncedValue, setDebouncedValue] = useState(value);
  // useDebouncedValue effect
  useEffect(() => {
    // set debouncedValue to value (passed in) after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    // clear timeout if value changes (also on delay change or unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  // return debouncedValue
  return debouncedValue;
}

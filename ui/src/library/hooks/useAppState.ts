import { useCallback, useEffect, useState } from "react";

const log = console;

const listeners: { [key: string]: ((v: any) => void)[] } = {};

export function useAppState<T>(
  key: string,
  initialValue: T
): [T, (v: T | ((previous: T) => T)) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    const listener = (v: T) => {
      setStoredValue(v);
    };
    if (!listeners[key]) {
      listeners[key] = [];
    }
    listeners[key].push(listener);
    return () => {
      listeners[key].splice(listeners[key].indexOf(listener), 1);
    };
  }, [key]);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback(
    (value: T | ((previous: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        for (const listener of listeners[key]) {
          listener(valueToStore);
        }
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        log.error(error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

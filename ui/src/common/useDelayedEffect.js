import { useEffect } from "react";

export function useDelayedEffect(callback, interval) {
  useEffect(() => {
    const timer = setTimeout(() => {
      callback();
    }, interval);
    return () => {
      clearTimeout(timer);
    };
  }, [callback, interval]);
}

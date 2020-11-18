import { useEffect, useCallback } from "react";

export const useKeys = (handlers) => {
  const handleKeyPress = useCallback(
    (event) => {
      if (handlers[event.code]) {
        handlers[event.code]();
      }
    },
    [handlers]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);
};

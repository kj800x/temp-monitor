import { useEffect, useCallback } from "react";

export const useKeys = (handlers, dependencies) => {
  const handleKeyPress = useCallback(
    (event) => {
      if (handlers[event.code]) {
        handlers[event.code]();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handlers, ...dependencies]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);
};

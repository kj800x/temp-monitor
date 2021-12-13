import { useEffect } from "react";

export function useTitle(title: string) {
  useEffect(() => {
    if (title) {
      const previousTitle = document.title;
      document.title = title;

      return () => {
        document.title = previousTitle;
      };
    }
  }, [title]);
}

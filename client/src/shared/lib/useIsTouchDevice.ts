import { useMemo } from "react";

export function useIsTouchDevice(): boolean {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }, []);
}

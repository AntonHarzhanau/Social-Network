import * as React from "react";

type Options = {
  delay?: number;
  moveThreshold?: number;
};

export function useLongPress(
  onLongPress: () => void,
  { delay = 350, moveThreshold = 10 }: Options = {},
) {
  const timerRef = React.useRef<number | null>(null);
  const startRef = React.useRef<{ x: number; y: number } | null>(null);
  const firedRef = React.useRef(false);

  const clear = React.useCallback(() => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startRef.current = null;
    firedRef.current = false;
  }, []);

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") return;

      firedRef.current = false;
      startRef.current = { x: e.clientX, y: e.clientY };

      timerRef.current = window.setTimeout(() => {
        firedRef.current = true;
        onLongPress();
      }, delay);
    },
    [delay, onLongPress],
  );

  const onPointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") return;
      if (!startRef.current) return;

      const dx = Math.abs(e.clientX - startRef.current.x);
      const dy = Math.abs(e.clientY - startRef.current.y);

      if (dx > moveThreshold || dy > moveThreshold) {
        if (timerRef.current != null) {
          window.clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }
    },
    [moveThreshold],
  );

  const onPointerUp = React.useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") return;

      if (firedRef.current) {
        e.preventDefault();
        e.stopPropagation();
      }
      clear();
    },
    [clear],
  );

  const onPointerCancel = React.useCallback(() => {
    clear();
  }, [clear]);

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel };
}

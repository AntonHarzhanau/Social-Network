import { useEffect, useRef, useState } from "react";

type Params = {
  enabled: boolean;
  onClose: () => void;

  lockPx?: number;
  closeDistancePx?: number;
  closeVelocity?: number;
  animationMs?: number;

  shouldStart?: (target: EventTarget | null) => boolean;
};

type SwipeState = {
  active: boolean;
  locked: boolean;
  startX: number;
  startY: number;
  startT: number;
};

const clampRubber = (dy: number) => {
  const LIMIT = 320;
  if (dy <= LIMIT) return dy;
  return LIMIT + (dy - LIMIT) * 0.25;
};

export function useSwipeDownToClose({
  enabled,
  onClose,
  lockPx = 10,
  closeDistancePx = 140,
  closeVelocity = 0.9, // px/ms
  animationMs = 180,
  shouldStart,
}: Params) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const st = useRef<SwipeState>({
    active: false,
    locked: false,
    startX: 0,
    startY: 0,
    startT: 0,
  });

  useEffect(() => {
    if (!enabled) {
      st.current.active = false;
      st.current.locked = false;
      setDragY(0);
      setIsDragging(false);
    }
  }, [enabled]);

  const onTouchStartCapture = (e: React.TouchEvent<HTMLElement>) => {
    if (!enabled) return;
    if (e.touches.length !== 1) return;

    if (shouldStart && !shouldStart(e.target)) return;

    const t = e.touches[0];
    st.current.active = true;
    st.current.locked = false;
    st.current.startX = t.clientX;
    st.current.startY = t.clientY;
    st.current.startT = performance.now();

    setIsDragging(false);
  };

  const onTouchMoveCapture = (e: React.TouchEvent<HTMLElement>) => {
    if (!enabled) return;
    if (!st.current.active) return;
    if (e.touches.length !== 1) return;

    const t = e.touches[0];
    const dx = t.clientX - st.current.startX;
    const dy = t.clientY - st.current.startY;

    if (dy < 0) return;

    if (!st.current.locked) {
      const verticalDominates = Math.abs(dy) > Math.abs(dx) * 1.2;
      if (dy > lockPx && verticalDominates) {
        st.current.locked = true;
        setIsDragging(true);
      } else {
        return;
      }
    }
    e.preventDefault();
    setDragY(clampRubber(dy));
  };

  const finishTouch = (clientY: number) => {
    const dy = clientY - st.current.startY;
    const dt = Math.max(1, performance.now() - st.current.startT);
    const velocity = dy / dt;

    const shouldClose =
      st.current.locked && (dy > closeDistancePx || velocity > closeVelocity);

    st.current.active = false;
    const wasLocked = st.current.locked;
    st.current.locked = false;

    if (!wasLocked) return;

    setIsDragging(false);

    if (shouldClose) {
      const out = typeof window !== "undefined" ? window.innerHeight : 900;
      setDragY(out);
      window.setTimeout(() => onClose(), animationMs);
    } else {
      setDragY(0);
    }
  };

  const onTouchEndCapture = (e: React.TouchEvent<HTMLElement>) => {
    if (!enabled) return;
    if (!st.current.active) return;

    const t = e.changedTouches[0];
    if (!t) return;

    finishTouch(t.clientY);
  };

  const onTouchCancelCapture = () => {
    if (!enabled) return;
    if (!st.current.active) return;
    st.current.active = false;
    st.current.locked = false;
    setIsDragging(false);
    setDragY(0);
  };

  const onPointerDownCapture = (e: React.PointerEvent<HTMLElement>) => {
    if (!enabled) return;
    if (shouldStart && !shouldStart(e.target)) return;

    if (e.pointerType !== "touch") return;

    st.current.active = true;
    st.current.locked = false;
    st.current.startX = e.clientX;
    st.current.startY = e.clientY;
    st.current.startT = performance.now();
    setIsDragging(false);
  };

  const onPointerMoveCapture = (e: React.PointerEvent<HTMLElement>) => {
    if (!enabled) return;
    if (!st.current.active) return;
    if (e.pointerType !== "touch") return;

    const dx = e.clientX - st.current.startX;
    const dy = e.clientY - st.current.startY;

    if (dy < 0) return;

    if (!st.current.locked) {
      const verticalDominates = Math.abs(dy) > Math.abs(dx) * 1.2;
      if (dy > lockPx && verticalDominates) {
        st.current.locked = true;
        setIsDragging(true);
      } else {
        return;
      }
    }

    e.preventDefault();
    setDragY(clampRubber(dy));
  };

  const onPointerUpCapture = (e: React.PointerEvent<HTMLElement>) => {
    if (!enabled) return;
    if (!st.current.active) return;
    if (e.pointerType !== "touch") return;

    finishTouch(e.clientY);
  };

  const onPointerCancelCapture = () => {
    onTouchCancelCapture();
  };

  return {
    bind: {
      onTouchStartCapture,
      onTouchMoveCapture,
      onTouchEndCapture,
      onTouchCancelCapture,

      onPointerDownCapture,
      onPointerMoveCapture,
      onPointerUpCapture,
      onPointerCancelCapture,
    } as const,

    style: {
      transform: dragY ? `translate3d(0, ${dragY}px, 0)` : undefined,
      transition: isDragging ? "none" : `transform ${animationMs}ms ease`,
      touchAction: "pan-x",
    } as React.CSSProperties,

    dragY,
    isDragging,
  };
}

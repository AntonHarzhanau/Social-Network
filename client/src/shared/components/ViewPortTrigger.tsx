import { useEffect, useRef } from "react";
import { cn } from "../lib/utils";

interface ViewPortTriggerProps {
  /** Function that is called when the trigger comes into view */
  onVisible: () => void | Promise<void>;
  /**
   * The "window" to observe.
   * If observing within a scrolling container is desired.
   * If omitted, the viewport (browser window) will be used.
   */
  root?: Element | null;
  rootMargin?: string;
  /** Intersection threshold (0–1). 0.1 means "10% of the element is in the visible zone" */
  threshold?: number;
  /**
   * If true, the function will be called only once (default).
   * If false, it will be called every time the element appears in the viewport.
   */
  once?: boolean;
  /** CSS class name to apply to the trigger element */
  className?: string;
}

const ViewPortTrigger = ({
  onVisible,
  root,
  rootMargin = "0px",
  threshold = 0.1,
  once = true,
  className,
}: ViewPortTriggerProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const triggeredRef = useRef<boolean>(false);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        if (once && triggeredRef.current) return;

        triggeredRef.current = true;
        onVisible();
      },
      {
        root: root ?? null,
        rootMargin,
        threshold,
      },
    );
    observer.observe(target);

    return () => {
      observer.unobserve(target);
      observer.disconnect();
    };
  }, [onVisible, once, root, rootMargin, threshold]);
  return (
    <div ref={ref} className={cn("h-4 w-full", className)}/>
  );
};

export default ViewPortTrigger;

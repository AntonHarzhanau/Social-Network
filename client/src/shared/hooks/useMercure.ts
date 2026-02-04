import { useEffect, useRef } from "react";

const ORIGIN = window.location.origin;
export const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

export const MERCURE_URL = new URL(
  import.meta.env.VITE_MERCURE_URL || "/.well-known/mercure",
  ORIGIN,
).toString();

// const MERCURE_URL =
//   import.meta.env.VITE_MERCURE_URL ||
//   "http://localhost:3000/.well-known/mercure";

interface UseMercureOptions<TPayload = unknown> {
  topic: string;
  onMessage: (data: TPayload, event: MessageEvent) => void;
  parse?: (event: MessageEvent) => TPayload;
  onError?: (error: Event) => void;
  enable?: boolean;
}

export const useMercure = <TPayload = unknown>({
  topic,
  onMessage,
  parse,
  onError,
  enable = true,
}: UseMercureOptions<TPayload>) => {
  const onMessageRef = useRef(onMessage);
  const parseRef = useRef(parse);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onMessageRef.current = onMessage;
    parseRef.current = parse;
    onErrorRef.current = onError;
  }, [onMessage, parse, onError]);

  useEffect(() => {
    if (!enable || !topic) return;

    const url = new URL(MERCURE_URL);
    url.searchParams.set("topic", topic);

    const eventSource = new EventSource(url.toString(), {
      withCredentials: true,
    });

    eventSource.onopen = () => {
      //   console.log("Mercure connected:", url.toString());
    };

    eventSource.onmessage = (event) => {
      //   console.log("Mercure message received:", event);
      try {
        const parser = parseRef.current;
        const data = parser
          ? parser(event)
          : (JSON.parse(event.data) as TPayload);

        onMessageRef.current(data, event);
      } catch (e) {
        console.error("Mercure parse error:", e);
      }
    };

    eventSource.onerror = (err) => {
      console.error("Mercure error:", err);
      onErrorRef.current?.(err);
    };

    return () => {
      eventSource.close();
      //   console.log("Mercure connection closed:", url.toString());
    };
  }, [topic, enable]);
};

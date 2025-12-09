import { useEffect } from "react";

const MERCURE_URL =
  import.meta.env.VITE_MERCURE_URL ||
  "http://localhost:3000/.well-known/mercure";

interface UseMercureOptions<TPayload = unknown> {
  topic: string;
  onMessage: (data: TPayload, event: MessageEvent) => void;
  parse?: (data: MessageEvent) => TPayload;
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
  useEffect(() => {
    if (!enable || !topic || !onMessage) {
      return;
    }

    const url = new URL(MERCURE_URL);
    url.searchParams.append("topic", topic);

    const eventSource = new EventSource(url.toString());

    eventSource.onmessage = (event) => {
      try {
        const data = parse
          ? parse(event)
          : (JSON.parse(event.data) as TPayload);

        onMessage(data, event);
      } catch (error) {
        console.error("Error parsing Mercure message:", error);
      }
    };

    eventSource.onerror = (err) => {
      console.error("Mercure error:", err);
      onError?.(err);
    };

    return () => {
      eventSource.close();
    };
  }, [topic, enable, onMessage, parse, onError]);
};


// example usage:

// interface NotificationPayload {
//   id: string;
//   type: string;
//   text: string;
// }

// useMercure<NotificationPayload>({
//   topic: "https://qynso.local/notifications/{userId}",
//   onMessage: (notification) => {
//     // Zustand /  toast
//   },
// });

// Или если нужно самому парсить не-JSON:
// useMercure<string>({
//   topic: "https://qynso.local/raw",
//   parse: (event) => event.data as string,
//   onMessage: (data) => {
//     console.log("raw data", data);
//   },
// });

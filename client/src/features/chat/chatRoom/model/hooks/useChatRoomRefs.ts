import { useEffect, useRef } from "react";
import type { Message } from "@/entities/chat/model/types";

export type Ref<T> = { current: T };

export function useAliveRef(): Ref<boolean> {
  const aliveRef = useRef(true);
  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);
  return aliveRef as unknown as Ref<boolean>;
}

export function useLatestRef<T>(value: T): Ref<T> {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref as unknown as Ref<T>;
}

export function useLatestMessageRefs(params: {
  messages: Message[];
  unreadSet: Set<string>;
  query: any;
}) {
  const messagesRef = useLatestRef(params.messages);
  const unreadRef = useLatestRef(params.unreadSet);
  const queryRef = useLatestRef(params.query);
  return { messagesRef, unreadRef, queryRef };
}

import { useCallback, useEffect, useRef } from "react";
import type { Message } from "@/entities/chat/model/types";
import type { Ref } from "./useChatRoomRefs";

function parseServerTime(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const t = Date.parse(iso.replace(/\+00:00$/, "Z"));
  return Number.isFinite(t) ? t : null;
}

export function useReadScheduler(params: {
  readDebounceMs: number;
  currentUserId?: string;
  messagesRef: Ref<Message[]>;
  aliveRef: Ref<boolean>;
  lastReadAtRef: Ref<string | null>;
  lastReadMessageIdRef: Ref<string | null>;
  markReadUpTo: (id: string) => void;
}) {
  const readTimerRef = useRef<number | null>(null);
  const lastPlannedReadRef = useRef<string | null>(null);

  const shouldSendReadForId = useCallback(
    (id: string) => {
      const msg = params.messagesRef.current.find((m) => m.id === id);
      if (!msg) return false;

      const isMine =
        !!params.currentUserId && msg.sender.id === params.currentUserId;
      if (isMine) return false;

      if (id === params.lastReadMessageIdRef.current) return false;

      const lrMs = parseServerTime(params.lastReadAtRef.current) ?? -Infinity;
      const createdMs = Date.parse(msg.createdAt);
      if (Number.isFinite(createdMs) && createdMs <= lrMs) return false;

      return true;
    },
    [params],
  );

  const scheduleRead = useCallback(
    (id?: string) => {
      if (!id) return;
      if (!shouldSendReadForId(id)) return;
      if (id === lastPlannedReadRef.current) return;

      lastPlannedReadRef.current = id;
      if (readTimerRef.current) window.clearTimeout(readTimerRef.current);

      readTimerRef.current = window.setTimeout(() => {
        if (!params.aliveRef.current) return;
        if (!shouldSendReadForId(id)) return;
        params.markReadUpTo(id);
      }, params.readDebounceMs);
    },
    [params, shouldSendReadForId],
  );

  useEffect(() => {
    return () => {
      if (readTimerRef.current) window.clearTimeout(readTimerRef.current);
    };
  }, []);

  return { scheduleRead };
}

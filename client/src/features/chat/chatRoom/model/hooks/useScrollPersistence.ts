import { useCallback, useEffect, useRef, useState } from "react";
import { useOpenedChatsStore } from "@/features/chat/openedChats/model/openedChatsStore";
import type { Ref } from "./useChatRoomRefs";

export type SetScrollFn = (
  chatId: string,
  patch: { isAtBottom: boolean; bottomVisibleMessageId?: string },
) => void;

export function useScrollPersistence(params: {
  chatId: string;
  openStateRef: Ref<any>;
  setScroll: SetScrollFn;
  computeBottomVisibleMessageId: () => string | undefined;
  recomputeTail: () => boolean;
  aliveRef: Ref<boolean>;
}) {
  const [isAtTail, setIsAtTail] = useState(true);

  const saveTimerRef = useRef<number | null>(null);
  const lastSavedRef = useRef<{ bottomId?: string; atTail: boolean } | null>(
    null,
  );

  const scheduleSaveScroll = useCallback(() => {
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);

    saveTimerRef.current = window.setTimeout(() => {
      if (!params.aliveRef.current) return;

      const bottomId = params.computeBottomVisibleMessageId();
      const atTail = params.recomputeTail();

      const prev = lastSavedRef.current;
      if (prev && prev.bottomId === bottomId && prev.atTail === atTail) return;

      lastSavedRef.current = { bottomId, atTail };
      setIsAtTail(atTail);

      params.setScroll(params.chatId, {
        isAtBottom: atTail,
        ...(bottomId ? { bottomVisibleMessageId: bottomId } : {}),
      });

      params.openStateRef.current =
        useOpenedChatsStore.getState().byId[params.chatId];
    }, 150);
  }, [params]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, []);

  return { isAtTail, setIsAtTail, scheduleSaveScroll };
}

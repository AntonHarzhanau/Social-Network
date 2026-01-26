import { useEffect } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { fetchMessages } from "@/entities/chat/api/chat";
import { mergeLatestIntoCache } from "@/entities/chat/lib/messageInfiniteCache";

export function useSyncLatest(params: {
  chatId?: string;
  pageSize: number;
  qc: QueryClient;
  aliveRef: React.MutableRefObject<boolean>;
}) {
  useEffect(() => {
    if (!params.chatId) return;

    let cancelled = false;
    (async () => {
      const latest = await fetchMessages(params.chatId!, {
        limit: params.pageSize,
      });
      if (cancelled || !params.aliveRef.current) return;
      mergeLatestIntoCache(params.qc, params.chatId!, latest);
    })();

    return () => {
      cancelled = true;
    };
  }, [params.chatId, params.pageSize, params.qc, params.aliveRef]);
}

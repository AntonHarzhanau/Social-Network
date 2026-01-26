import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { Message } from "@/entities/chat/model/types";
import { chatMessageKeys } from "@/entities/chat/model/hooks/messageQueryKeys";

type MsgInf = InfiniteData<Message[], any>;

function sortAscStable(arr: Message[]) {
  return arr.slice().sort((a, b) => {
    const ta = new Date(a.createdAt).getTime();
    const tb = new Date(b.createdAt).getTime();
    if (ta !== tb) return ta - tb;
    return a.id.localeCompare(b.id);
  });
}

export function mergeLatestIntoCache(
  qc: QueryClient,
  chatId: string,
  latest: Message[],
) {
  const key = chatMessageKeys.byChat(chatId);
  qc.setQueryData<MsgInf>(key, (prev) => {
    const latestSorted = sortAscStable(latest);
    if (!prev)
      return { pages: [latestSorted], pageParams: [{ kind: "initial" }] };
    const pages = prev.pages.slice();
    if (pages.length === 0)
      return { pages: [latestSorted], pageParams: [{ kind: "initial" }] };

    const lastIdx = pages.length - 1;
    const map = new Map<string, Message>();
    for (const m of pages[lastIdx] ?? []) map.set(m.id, m);
    for (const m of latestSorted) map.set(m.id, m);
    pages[lastIdx] = sortAscStable(Array.from(map.values()));
    return { ...prev, pages };
  });
}

export function appendMessageToCache(
  qc: QueryClient,
  chatId: string,
  msg: Message,
) {
  const key = chatMessageKeys.byChat(chatId);
  qc.setQueryData<MsgInf>(key, (prev) => {
    if (!prev) return { pages: [[msg]], pageParams: [{ kind: "initial" }] };
    for (const p of prev.pages) if (p.some((m) => m.id === msg.id)) return prev;

    const pages = prev.pages.slice();
    if (pages.length === 0) pages.push([]);
    const lastIdx = pages.length - 1;
    pages[lastIdx] = sortAscStable([...(pages[lastIdx] ?? []), msg]);
    return { ...prev, pages };
  });
}

export function updateMessageInCache(
  qc: QueryClient,
  chatId: string,
  messageId: string,
  next: Message,
) {
  const key = chatMessageKeys.byChat(chatId);
  qc.setQueryData<MsgInf>(key, (prev) => {
    if (!prev) return prev;
    let changed = false;

    const pages = prev.pages.map((p) => {
      const idx = p.findIndex((m) => m.id === messageId);
      if (idx < 0) return p;
      changed = true;
      const copy = p.slice();
      copy[idx] = next;
      return sortAscStable(copy);
    });

    return changed ? { ...prev, pages } : prev;
  });
}

export function removeMessageFromCache(
  qc: QueryClient,
  chatId: string,
  messageId: string,
) {
  const key = chatMessageKeys.byChat(chatId);
  qc.setQueryData<MsgInf>(key, (prev) => {
    if (!prev) return prev;
    let changed = false;

    const pages = prev.pages.map((p) => {
      const next = p.filter((m) => m.id !== messageId);
      if (next.length !== p.length) changed = true;
      return next;
    });

    return changed ? { ...prev, pages } : prev;
  });
}

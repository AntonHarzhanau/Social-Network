import type { ChatFilter } from "./types";

export const chatQueryKeys = {
  all: ["chats"] as const,
  list: (filter: ChatFilter, limit: number) =>
    [...chatQueryKeys.all, "list", { filter, limit }] as const,
  byId: (chatId: string) => [...chatQueryKeys.all, "byId", chatId] as const,
  members: (chatId: string, search?: string) =>
    [
      ...chatQueryKeys.all,
      "members",
      chatId,
      { search: search ?? "" },
    ] as const,
  unread: () => [...chatQueryKeys.all, "unread-summary"] as const,
};

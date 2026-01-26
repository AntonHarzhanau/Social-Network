import type { ChatFilter } from "../api/chat";

export const chatKeys = {
  all: ["chats"] as const,
  list: (filter: ChatFilter, limit: number) =>
    [...chatKeys.all, "list", { filter, limit }] as const,
  byId: (chatId: string) => [...chatKeys.all, "byId", chatId] as const,
};

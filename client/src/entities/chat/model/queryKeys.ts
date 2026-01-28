import type { ChatFilter } from "./types";

export const chatKeys = {
  all: ["chats"] as const,
  list: (filter: ChatFilter, limit: number) =>
    [...chatKeys.all, "list", { filter, limit }] as const,
  byId: (chatId: string) => [...chatKeys.all, "byId", chatId] as const,
  members: (chatId: string, search?: string) =>
    [...chatKeys.all, "members", chatId, { search: search ?? "" }] as const,
};

export type ChatsFilter = "all" | "unread";

export const chatKeys = {
  all: ["chat"] as const,

  // списки чатов (infinite) по фильтру
  lists: () => [...chatKeys.all, "list"] as const,
  list: (filter: ChatsFilter) => [...chatKeys.lists(), { filter }] as const,

  // один чат
  details: () => [...chatKeys.all, "detail"] as const,
  detail: (chatId: string) => [...chatKeys.details(), chatId] as const,

  // агрегаты/сводки
  summaries: () => [...chatKeys.all, "summary"] as const,
  unreadCount: () => [...chatKeys.summaries(), "unreadCount"] as const,
};

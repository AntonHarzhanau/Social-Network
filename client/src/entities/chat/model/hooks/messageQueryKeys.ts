export const chatMessageKeys = {
  all: ["chats", "messages"] as const,
  byChat: (chatId: string) => [...chatMessageKeys.all, chatId] as const,
};

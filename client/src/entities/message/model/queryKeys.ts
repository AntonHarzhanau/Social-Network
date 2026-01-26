export const messageKeys = {
  all: ["message"] as const,

  // сообщения по чату (infinite)
  lists: () => [...messageKeys.all, "list"] as const,
  list: (chatId: string) => [...messageKeys.lists(), { chatId }] as const,

  // при необходимости — детали сообщения (если появятся)
  details: () => [...messageKeys.all, "detail"] as const,
  detail: (messageId: string) => [...messageKeys.details(), messageId] as const,
};

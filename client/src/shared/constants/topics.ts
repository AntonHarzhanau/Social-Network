export const topics = {
  userNotifications: (userId: string) =>
    `/users/${userId}/notifications`,
  chat: (chatId: string) => `/chats/${chatId}`,
};

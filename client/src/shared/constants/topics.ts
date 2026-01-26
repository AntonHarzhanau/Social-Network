const TOPIC_BASE = import.meta.env.VITE_TOPIC_BASE;

export const topics = {
  userNotifications: (userId: string) =>
    `${TOPIC_BASE}/users/${userId}/notifications`,
  chat: (chatId: string) => `https://social-network.local/chats/${chatId}`,
};

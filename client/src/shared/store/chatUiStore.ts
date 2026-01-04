import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChatUiState {
  activeChatId: string;

  scrollAnchorByChat: Record<string, string | null>;
  lastReadByChat: Record<string, string | null>;

  setActiveChat: (chatId: string) => void;
  closeChat: (chatId: string) => void;

  setScrollAnchor: (chatId: string, messageId: string | null) => void;
  setLastRead: (chatId: string, messageId: string | null) => void;
}

export const useChatUiStore = create<ChatUiState>()(
  persist(
    (set) => ({
      activeChatId: "",
      scrollAnchorByChat: {},
      lastReadByChat: {},

      setActiveChat: (chatId) => set({ activeChatId: chatId }),

      closeChat: (chatId) =>
        set((s) => ({
          activeChatId: s.activeChatId === chatId ? "" : s.activeChatId,
          scrollAnchorByChat: { ...s.scrollAnchorByChat, [chatId]: null },
        })),

      setScrollAnchor: (chatId, messageId) =>
        set((s) => ({
          scrollAnchorByChat: { ...s.scrollAnchorByChat, [chatId]: messageId },
        })),

      setLastRead: (chatId, messageId) =>
        set((s) => ({
          lastReadByChat: { ...s.lastReadByChat, [chatId]: messageId },
        })),
    }),
    { name: "chat-ui" },
  ),
);

import type { ChatResponse } from "../api/chat";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OpenChatsState {
  openChats: ChatResponse[];
  openChat: (chat: ChatResponse) => void;
  closeChat: (chatId: string) => void;
  setOpenChats: (chats: ChatResponse[]) => void;
}

export const useOpenChatsStore = create<OpenChatsState>()(
  persist(
    (set) => ({
      openChats: [],

      openChat: (chat) =>
        set((s) => {
          if (s.openChats.some((c) => c.id === chat.id)) {
            return s;
          }
          return { openChats: [...s.openChats, chat] };
        }),

      closeChat: (chatId) =>
        set((s) => ({
          openChats: s.openChats.filter((c) => c.id !== chatId),
        })),

      setOpenChats: (chats) => set({ openChats: chats }),
    }),
    { name: "open-chats" },
  ),
);

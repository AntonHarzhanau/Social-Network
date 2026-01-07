import type { Chat } from "@/entities/chat/model/types";
import { create } from "zustand";

interface OpenChatsState {
  openChats: Chat[];
  openChat: (chat: Chat) => void;
  closeChat: (chatId: string) => void;
  setOpenChats: (chats: Chat[]) => void;
  reset: () => void;
}

export const useOpenChatsStore = create<OpenChatsState>(
    (set) => ({
      openChats: [],
      reset: () => set({ openChats: [] }),
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
);

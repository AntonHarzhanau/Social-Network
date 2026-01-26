import { create } from "zustand";

interface OpenChatsState {
  openChatIds: string[];
  openChat: (chatId: string) => void;
  closeChat: (chatId: string) => void;
  setOpenChats: (chatIds: string[]) => void;
  reset: () => void;
}

export const useOpenChatsStore = create<OpenChatsState>((set) => ({
  openChatIds: [],

  reset: () => set({ openChatIds: [] }),

  openChat: (chatId) =>
    set((s) => {
      if (s.openChatIds.includes(chatId)) return s;
      return { openChatIds: [...s.openChatIds, chatId] };
    }),

  closeChat: (chatId) =>
    set((s) => ({
      openChatIds: s.openChatIds.filter((id) => id !== chatId),
    })),

  setOpenChats: (chatIds) => set({ openChatIds: chatIds }),
}));

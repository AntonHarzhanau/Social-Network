import { create } from "zustand";
import type { ChatResponse, MessageResponse } from "../api/chat";

interface ChatStoreState {
  chats: ChatResponse[];
  currentChateId: string;
  liveMessages: Record<string, MessageResponse[]>;

  addChat: (chat: ChatResponse) => void;
  removeChat: (id: string) => void;
  changeCurrentChat: (id: string) => void;

  addMessage: (chatId: string, message: MessageResponse) => void;
  removeMessage: (chatId: string, messageId: string) => void;
  clearLiveMessages: (chatId: string) => void;
}

export const useChatStore = create<ChatStoreState>((set) => ({
  chats: [],
  currentChateId: "",
  liveMessages: {},

  addChat: (chat) =>
    set((state) => ({
      chats: state.chats.some((c) => c.id === chat.id)
        ? state.chats
        : [...state.chats, chat],
    })),

  removeChat: (id) =>
    set((state) => ({
      chats: state.chats.filter((chat) => chat.id !== id),
      currentChateId: state.currentChateId === id ? "" : state.currentChateId,
    })),

  changeCurrentChat: (id) =>
    set(() => ({
      currentChateId: id,
    })),

  addMessage: (chatId, message) =>
    set((state) => {
      const prev = state.liveMessages[chatId] ?? [];

      if (prev.some((m) => m.id === message.id)) {
        return state;
      }
      return {
        liveMessages: {
          ...state.liveMessages,
          [chatId]: [...prev, message],
        },
      };
    }),

    removeMessage(chatId, messageId) {
        set((state) => {
            const prev = state.liveMessages[chatId] ?? [];
            const exists = prev.some((m) => m.id === messageId);
            console.log("Removing message:", { chatId, messageId, exists });
            return {
                liveMessages: {
                    ...state.liveMessages,
                    [chatId]: prev.filter((m) => m.id !== messageId),
                },
            };
        })
    },

  clearLiveMessages: (chatId) =>
    set((state) => {
      if (!state.liveMessages[chatId]) return state;
      return {
        liveMessages: {
          ...state.liveMessages,
          [chatId]: [],
        },
      };
    }),
}));

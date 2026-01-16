import { create } from "zustand";

interface ChatUiState {
  activeChatId: string;
  cursorByChat: Record<string, string | null>;

  setActiveChat: (chatId: string) => void;

  setCursor: (chatId: string, messageId: string | null) => void;

  setCursorIfEmpty: (chatId: string, messageId: string | null) => void;

  closeChat: (chatId: string) => void;

  reset: () => void;
}

const initialState = {
  activeChatId: "",
  cursorByChat: {} as Record<string, string | null>,
};

export const useChatUiStore = create<ChatUiState>((set, get) => ({
  ...initialState,

  setActiveChat: (chatId) => set({ activeChatId: chatId }),

  setCursor: (chatId, messageId) =>
    set((s) => ({
      cursorByChat: { ...s.cursorByChat, [chatId]: messageId },
    })),

  setCursorIfEmpty: (chatId, messageId) => {
    const current = get().cursorByChat[chatId];

    if (current == null) {
      set((s) => ({
        cursorByChat: { ...s.cursorByChat, [chatId]: messageId },
      }));
    }
  },

  closeChat: (chatId) =>
    set((s) => {
      const { [chatId]: _removed, ...rest } = s.cursorByChat;

      return {
        activeChatId: s.activeChatId === chatId ? "" : s.activeChatId,
        cursorByChat: rest,
      };
    }),

  reset: () => set({ ...initialState }),
}));

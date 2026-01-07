import { create } from "zustand";

interface ChatUiState {
  activeChatId: string;
  cursorByChat: Record<string, string | null>;

  setActiveChat: (chatId: string) => void;

  // cursor = id сообщения, на котором остановился пользователь
  // cursor = null => "первое открытие / держимся низа"
  setCursor: (chatId: string, messageId: string | null) => void;

  // удобно, чтобы не перетирать cursor, если пользователь уже успел проскроллить,
  // а серверный lastRead пришёл позже
  setCursorIfEmpty: (chatId: string, messageId: string | null) => void;

  closeChat: (chatId: string) => void;

  // при смене пользователя/логауте
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
    // пусто = undefined (ещё не было) или null (первое открытие/низ)
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
        cursorByChat: rest, // убираем ключ полностью, а не храним null
      };
    }),

  reset: () => set({ ...initialState }),
}));

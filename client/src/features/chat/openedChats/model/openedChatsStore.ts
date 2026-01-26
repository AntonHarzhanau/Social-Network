import { create } from "zustand";

export type ChatUiState = {
  chatId: string;
  bottomVisibleMessageId?: string;
  isAtBottom: boolean;
  scrollTop?: number;
};

type OpenedChatsState = {
  openedIds: string[];
  byId: Record<string, ChatUiState>;

  open: (chatId: string) => void;
  close: (chatId: string) => void;

  setScroll: (
    chatId: string,
    patch: Partial<
      Pick<ChatUiState, "bottomVisibleMessageId" | "isAtBottom" | "scrollTop">
    >,
  ) => void;
};

export const useOpenedChatsStore = create<OpenedChatsState>((set, get) => ({
  openedIds: [],
  byId: {},

  open: (chatId) => {
    const s = get();
    if (s.openedIds.includes(chatId)) {
      if (!s.byId[chatId]) {
        set({
          byId: { ...s.byId, [chatId]: { chatId, isAtBottom: true } },
        });
      }
      return;
    }

    set({
      openedIds: [...s.openedIds, chatId],
      byId: { ...s.byId, [chatId]: { chatId, isAtBottom: true } },
    });
  },

  close: (chatId) => {
    const s = get();
    if (!s.openedIds.includes(chatId)) return;

    const nextById = { ...s.byId };
    delete nextById[chatId];

    set({
      openedIds: s.openedIds.filter((id) => id !== chatId),
      byId: nextById,
    });
  },

  setScroll: (chatId, patch) => {
    const s = get();
    const cur = s.byId[chatId];
    if (!cur) return;

    const next: ChatUiState = {
      ...cur,
      ...(patch.isAtBottom !== undefined
        ? { isAtBottom: patch.isAtBottom }
        : {}),
      ...(patch.bottomVisibleMessageId !== undefined
        ? { bottomVisibleMessageId: patch.bottomVisibleMessageId }
        : {}),
      ...(patch.scrollTop !== undefined ? { scrollTop: patch.scrollTop } : {}),
    };

    set({ byId: { ...s.byId, [chatId]: next } });
  },
}));

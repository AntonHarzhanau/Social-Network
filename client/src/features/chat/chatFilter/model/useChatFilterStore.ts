import { create } from "zustand";

interface ChatFilterState {
  filter: "all" | "unread";
  setFilter: (filter: "all" | "unread") => void;
}

export const useChatFilterStore = create<ChatFilterState>((set) => ({
  filter: "all",

  setFilter: (filter: "all" | "unread") => set({ filter }),
}));

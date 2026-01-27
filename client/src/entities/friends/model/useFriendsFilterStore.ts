import { create } from "zustand";

interface FriendsFilterState {
  filter: "all" | "sent" | "received";
  setFilter: (filter: "all" | "sent" | "received") => void;
}

export const useFriendsFilterStore = create<FriendsFilterState>((set) => ({
  filter: "all",

  setFilter: (filter: "all" | "sent" | "received") => set({ filter }),
}));

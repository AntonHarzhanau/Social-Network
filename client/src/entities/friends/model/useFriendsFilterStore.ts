import { create } from "zustand";

export type FriendsFilter = "all" | "sent" | "received";

export interface FriendsFilterState {
  filter: FriendsFilter;
  setFilter: (filter: FriendsFilter) => void;
}

export const useFriendsFilterStore = create<FriendsFilterState>((set) => ({
  filter: "all",
  setFilter: (filter) => set({ filter }),
}));

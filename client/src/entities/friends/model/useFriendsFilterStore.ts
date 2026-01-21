interface FriendsFilterState {
  filter: "all" | "sent" | "received" | "";
  setFilter: (filter: "all" | "sent" | "received" | "") => void;
}

import { create } from "zustand";

export const useFriendsFilterStore = create<FriendsFilterState>((set) => ({
  filter: "",

  setFilter: (filter: "all" | "sent" | "received" | "") => set({ filter }),
}));

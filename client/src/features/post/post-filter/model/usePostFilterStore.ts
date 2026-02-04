import { create } from "zustand";

export type PostFilterType = "all" | "friends" | "groups";

interface PostFilterState {
  filter: PostFilterType;
  setFilter: (filter: PostFilterType) => void;
}

export const usePostFilterStore = create<PostFilterState>((set) => ({
  filter: "all",

  setFilter: (filter: PostFilterType) => set({ filter }),
}));

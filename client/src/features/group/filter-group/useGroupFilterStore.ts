import type { GroupFilter } from "@/entities/group/model/types";
import { create } from "zustand";

interface GroupFilterState {
  filter: GroupFilter;
  setFilter: (filter: GroupFilter) => void;
}

export const useGroupFilterStore = create<GroupFilterState>((set) => ({
  filter: "all",

  setFilter: (filter: GroupFilter) => set({ filter }),
}));

import type { MediaResponse } from "@/entities/media/model/types";
import type { UserPreview } from "@/entities/user/model/types"
import { create } from "zustand";

export type MediaViewerPayload = {
    author?: UserPreview | null;
    medias: MediaResponse[];
    initialIndex: number;
}

type MediaViewState = {
    isOpen: boolean;
    payload?: MediaViewerPayload | null;
    activeIndex: number;

    openViewer: (payload: MediaViewerPayload) => void;
    closeViewer: () => void;
    setActiveIndex: (index: number) => void;
}

export const useMediaViewerStore = create<MediaViewState>((set) => ({
    isOpen: false,
    payload: null,
    activeIndex: 0,

    openViewer: (payload) => set({ isOpen: true, payload, activeIndex: payload.initialIndex }),
    closeViewer: () => set({ isOpen: false, payload: null, activeIndex: 0 }),
    setActiveIndex: (index) => set({ activeIndex: index }),
}))

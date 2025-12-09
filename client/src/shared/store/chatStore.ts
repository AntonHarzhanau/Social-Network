import { create } from "zustand";
import type { ChatResponse } from "../api/chat";

interface ChatStoreState {
    chats: ChatResponse[];
    currentChateId: string;

    addChat: (chat: ChatResponse) => void;
    removeChat: (id: string) => void;
    changeCurrentChat: (id: string) => void
}

export const useChatStore = create<ChatStoreState>((set) => ({
    chats: [],
    currentChateId: "",
    addChat: (chat) =>
        set((state) => ({
            chats: state.chats.some((c) => c.id === chat.id)
                ? state.chats
                : [...state.chats, chat]
        })),

    removeChat: (id) =>
        set((state) => ({
            chats: state.chats.filter((chat) => chat.id !== id),
            currentChateId: state.currentChateId === id ? "" : state.currentChateId
        })),

    changeCurrentChat: (id) =>
        set(() => ({
            currentChateId: id
        }))
}))

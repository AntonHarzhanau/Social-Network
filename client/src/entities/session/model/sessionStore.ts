import { create } from "zustand";
import type { UserPreview } from "@/entities/user/model/types";

export type SessionStatus = "loading" | "ready";

interface SessionState {
  user?: UserPreview | null;
  status: SessionStatus;

  setUser: (user: UserPreview | null) => void;
  setLoading: () => void;
}

export interface RegisterData {
  email: string;
  password: string;
}

export const sessionStore = create<SessionState>((set) => ({
  user: null,
  status: "loading",

  setUser: (user) => set({ user, status: "ready" }),
  setLoading: () => set({ status: "loading" }),
}));

export const isAuthenticated = () => {
  return sessionStore((s) => !!s.user && s.status === "ready");
};

export const sessionStatus = () => {
  return sessionStore((s) => s.status);
}

export const sessionUser = () => {
  return sessionStore((s) => s.user);
}

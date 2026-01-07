import { create } from "zustand";
import { useOpenChatsStore } from "@/entities/chat/model/openChatsStore";
import { queryClient } from "@/shared/lib/queryClient";
import { useChatUiStore } from "@/entities/chat/model/chatUiStore";
import type { UserPreview } from "@/entities/user/model/types";
import type { RegisterApiPayload } from "./registerApiSchema";
import { AuthApi } from "../api/authApi";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: UserPreview | null;

  login: (email: string, password: string) => Promise<void>;
  register: (registerData: RegisterApiPayload) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await AuthApi.login(email, password);
      localStorage.setItem("token", response.data.token);
      set({ isAuthenticated: true });

      const me = await AuthApi.me();
      set({ user: me.data });
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (registerData) => {
    set({ isLoading: true });
    try {
      await AuthApi.register(registerData);
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ isAuthenticated: false, user: null });
    useOpenChatsStore.getState().reset();
    useChatUiStore.getState().reset();
    queryClient.clear();
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({
          user: null,
          isAuthenticated: false,
        });
        return;
      }
      const me = await AuthApi.me();
      set({ user: me.data, isAuthenticated: true });
    } catch (error: any) {
        const status = error?.response?.status;
        
        set({ user: null, isAuthenticated: false });
        
        if (status === 401 || status === 403) {
          localStorage.removeItem("token");
          return;
        }
        throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

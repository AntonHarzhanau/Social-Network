import { useChatUiStore } from "@/entities/chat/model/chatUiStore";
import { useOpenChatsStore } from "@/entities/chat/model/openChatsStore";
import { sessionStore } from "@/entities/session/model/sessionStore";
import { authApi } from "@/features/auth/api/authApi";
import type { LoginFormSchema } from "@/features/auth/model/loginFormSchema";
import type { RegisterApiPayload } from "@/features/auth/model/registerApiSchema";
import { clearToken, getToken, setToken } from "@/shared/api/tokenStorage";
import { queryClient } from "@/shared/lib/queryClient";

const resetAppState = () => {
  useOpenChatsStore.getState().reset();
  useChatUiStore.getState().reset();
  queryClient.clear();
};

export const authActions = {
  async login(data: LoginFormSchema) {
    const session = sessionStore.getState();
    session.setLoading();

    try {
      resetAppState();

      const response = await authApi.login(data.email, data.password);
      setToken(response.data.token);

      const me = (await authApi.me()).data;
      session.setUser(me);

      await authApi.mercure();

      return me;
    } catch (error) {
      handleAuthRequired();
      throw error;
    }
  },

  async register(data: RegisterApiPayload) {
    return authApi.register(data);
  },

  async logout() {
    try {
      await authApi.logout();
    } catch (error) {
    } finally {
      handleAuthRequired();
    }
  },

  async checkAuth() {
    const session = sessionStore.getState();
    session.setLoading();

    if (getToken() == null) {
      session.setUser(null);
      return null;
    }

    try {
      const me = (await authApi.me()).data;
      session.setUser(me);
      await authApi.mercure();
      return me;
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        handleAuthRequired();
        return null;
      }

      session.setUser(null);
      throw error;
    }
  },

  async refreshMe() {
    try {
      const me = (await authApi.me()).data;
      sessionStore.getState().setUser(me);
      return me;
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        handleAuthRequired();
        return null;
      }
      throw error;
    }
  },
};

function handleAuthRequired() {
  clearToken();
  resetAppState();
  sessionStore.getState().setUser(null);
}

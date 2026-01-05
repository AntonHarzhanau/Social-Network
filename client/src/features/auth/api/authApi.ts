import type { RegisterApiPayload } from "@/shared/types/registerApiSchema";
import { apiClient } from "@/shared/api/apiClient";

export interface Me {
  id: string;
  username: string;
  avatarUrl?: string | null;
}

export const AuthApi = {
  login(email: string, password: string) {
    return apiClient.post<{ token: string }>("/auth/login", {
      email,
      password,
    });
  },
  register(registerData: RegisterApiPayload) {
    console.log("API Register data:", registerData);
    return apiClient.post("/auth/register", registerData);
  },
  logout() {
    return apiClient.post("/auth/logout");
  },
  refresh() {
    return apiClient.post<{ token: string }>("/auth/refresh");
  },
  me() {
    const response = apiClient.get<Me>("/auth/me");
    return response;
  },
};

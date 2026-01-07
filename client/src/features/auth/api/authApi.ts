import { apiClient } from "@/shared/api/apiClient";
import type { RegisterApiPayload } from "../model/registerApiSchema";
import type { UserPreview } from "@/entities/user/model/types";

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
    const response = apiClient.get<UserPreview>("/auth/me");
    return response;
  },
};

import { apiClient } from "@/shared/api/apiClient";
import type { RegisterApiPayload } from "@/features/auth/model/registerApiSchema";
import type { UserPreview } from "@/entities/user/model/types";

export const authApi = {
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
  me() {
    const response = apiClient.get<UserPreview>("/me");
    return response;
  },
  mercure() {
    return apiClient.post("/auth/mercure", null, { withCredentials: true });
  },
};

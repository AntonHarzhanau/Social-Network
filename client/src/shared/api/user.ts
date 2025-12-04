import { apiClient } from "./apiClient";
import type { Me } from "./auth";



export const fetchUsers = async (): Promise<Me[]> => {
  const response = await apiClient.get<Me[]>("/user");

  return response.data;
};

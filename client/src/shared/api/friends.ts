import { apiClient } from "./apiClient"
import type { Me } from "./auth"

export const fetchFriends = async (filter: string): Promise<Me[]> => {
    const response = await apiClient.get<Me[]>(`/friends/?type=${filter}`)
    return response.data;
}

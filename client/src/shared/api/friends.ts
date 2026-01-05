import { apiClient } from "./apiClient"
import type { Me } from "../../features/auth/api/authApi"

export const fetchFriends = async (): Promise<Me[]> => {
    const response = await apiClient.get<Me[]>(`/friends`)
    return response.data;
}

export const fetchFriendsRequest = async (type: 'sent' | 'received'): Promise<Me[]> => {
    const response = await apiClient.get<Me[]>(`/friends-requests?type=${type}`)
    return response.data;
}

export const sendFriendRequest = async (userId: string): Promise<void> => {
    await apiClient.post(`/friends-requests`, { userId })
}

export const respondToFriendRequest = async (userId: string, accept: boolean): Promise<void> => {
    await apiClient.post(`/friends-requests/${userId}/accept`, { accept })
}

export const declineFriendRequest = async (userId: string): Promise<void> => {
    await apiClient.post(`/friends-requests/${userId}/decline`)
}

export const cancelFriendRequest = async (userId: string): Promise<void> => {
    await apiClient.delete(`/friends-requests/${userId}`)
}

export const removeFriend = async (userId: string): Promise<void> => {
    await apiClient.delete(`/friends/${userId}`)
}

import { apiClient } from "./apiClient";
import type { Me } from "./auth";

export interface LastMessageResponse {
  id: string;
  content: string;
}

export interface MessageResponse {
    id: string;
    sender: Me;
    content: string;
    createdAt: string;
}

export interface ChatResponse {
  id: string;
  type: "self" | "direct" | "group";
  title?: string;
  avatarUrl?: string;
  lastMessage?: LastMessageResponse;
  lastMessageAt?: string;
}

export const fetchChats = async (): Promise<ChatResponse[]> => {
  const response = await apiClient.get<ChatResponse[]>("/chats");
  return response.data;
};

export const fetchMessages = async (chatId: string) => {
    const response = await apiClient.get(`/chats/${chatId}/messages`);
    console.log(response.data);
    return response.data;
}

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

const CHAT_PAGE_SIZE = 20;
const MESSAGE_PAGE_SIZE = 30;

export const fetchChats = async (
  page: number = 1,
  limit: number = CHAT_PAGE_SIZE,
): Promise<ChatResponse[]> => {
  const response = await apiClient.get<ChatResponse[]>("/chats", {
    params: {
      page,
      limit,
    },
  });
  return response.data;
};

export const fetchChatById = async (chatId: string): Promise<ChatResponse> => {
  const response = await apiClient.get<ChatResponse>(`/chats/${chatId}`);
  return response.data;
};

export const fetchMessages = async (
  chatId: string,
  page: number = 1,
  limit: number = MESSAGE_PAGE_SIZE,
) => {
  const response = await apiClient.get(`/chats/${chatId}/messages`, {
    params: {
      page,
      limit,
    },
  });
  return response.data;
};

export const sendMessage = async (
  chatId: string,
  content: string,
): Promise<void> => {
  await apiClient.post(`/messages/${chatId}/chat`, { content });
};

interface CreateDirectChatParams {
  participantId: string;
  content?: string;
}

interface CreateDirectChatResponse extends ChatResponse {
  id: string;
  type: "self" | "direct" | "group";
  messageId: string;
  content: string;
  createdAt: string;
}

export const createDirectChat = async (
  params: CreateDirectChatParams): Promise<CreateDirectChatResponse> => {
  const { participantId, content } = params;
  const response = await apiClient.post<CreateDirectChatResponse>(`/messages/${participantId}/direct`, {
    content,
  });
  return response.data;
};

import { apiClient } from "@/shared/api/apiClient";
import type { Chat, CreateDirectChatParams, Message } from "../model/types";

const CHAT_PAGE_SIZE = 20;

export const fetchChats = async (
  page: number = 1,
  limit: number = CHAT_PAGE_SIZE,
): Promise<Chat[]> => {
  const response = await apiClient.get<Chat[]>("/chats", {
    params: {
      page,
      limit,
    },
  });
  return response.data;
};

export const fetchChatById = async (chatId: string): Promise<Chat> => {
  const response = await apiClient.get<Chat>(`/chats/${chatId}`);
  return response.data;
};

type FetchMessageMode = "before" | "after" | "around" | "";

export const fetchMessages = async (
  chatId: string,
  params: {
    mode?: FetchMessageMode;
    messageId?: string;
    limit?: number;
  } = {},
): Promise<Message[]> => {
  const response = await apiClient.get<Message[]>(`/chats/${chatId}/messages`, {
    params,
  });
  return response.data;
};

export const sendMessage = async (
  chatId: string,
  content: string,
): Promise<void> => {
  await apiClient.post(`/messages/${chatId}/chat`, { content });
};

export const deleteMessage = async (messageId: string): Promise<void> => {
  await apiClient.delete(`/messages/${messageId}`);
};

export const createDirectChat = async (
  params: CreateDirectChatParams,
): Promise<void> => {
  const { participantId, content } = params;
  const response = await apiClient.post<void>(
    `/messages/${participantId}/direct`,
    {
      content,
    },
  );
  return response.data;
};

export const markMessagesAsRead = async (
  chatId: string,
  lastReadMessageId?: string,
): Promise<void> => {
  await apiClient.post(`/chats/${chatId}/read`, { lastReadMessageId });
};

export const getUnreadChatCount = async (): Promise<number> => {
  const response = await apiClient.get(`/chats/unread-summary`);
  console.log("response", response);
  return response.data;
};

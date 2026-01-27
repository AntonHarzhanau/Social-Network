import { apiClient } from "@/shared/api/apiClient";
import type {
  Chat,
  ChatFilter,
  CreateDirectChatParams,
  Message,
} from "../model/types";

export const CHAT_PAGE_SIZE = 10;

export const fetchChats = async (
  page: number = 1,
  limit: number = CHAT_PAGE_SIZE,
  filter: ChatFilter = "all",
): Promise<Chat[]> => {
  const response = await apiClient.get<Chat[]>("/chats", {
    params: {
      page,
      limit,
      filter,
    },
  });
  return response.data;
};

export const fetchChatById = async (chatId: string): Promise<Chat> => {
  const response = await apiClient.get<Chat>(`/chats/${chatId}`);
  return response.data;
};

type FetchMessageMode = "before" | "";

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

export const editMessage = async (
  messageId: string,
  content: string,
): Promise<void> => {
  await apiClient.put(`/messages/${messageId}`, { content });
  console.log("Message edited:", { messageId, content });
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

export type MarkReadMessageResponse = {
  lastReadMessageId: string;
  lastReadAt: string;
  chatId: string;
};

export const markMessagesAsRead = async (
  chatId: string,
  lastReadMessageId?: string,
): Promise<MarkReadMessageResponse> => {
  console.log("markMessagesAsRead called with:", { chatId, lastReadMessageId });
  const response = await apiClient.patch(`/chats/${chatId}/read`, {
    lastReadMessageId,
  });
  return response.data;
};

export const getUnreadChatCount = async (): Promise<number> => {
  const response = await apiClient.get(`/chats/unread-summary`);
  return response.data;
};

export type CreateChatPayload = {
  title: string;
  participantIds: string[];
};

export const createChat = async (payload: CreateChatPayload): Promise<Chat> => {
  const res = await apiClient.post<Chat>("/chats", payload);
  return res.data;
};

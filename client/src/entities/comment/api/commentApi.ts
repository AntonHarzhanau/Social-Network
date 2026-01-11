import { apiClient } from "@/shared/api/apiClient";
import type { CommentResponse, ToggleLikeResponse } from "../model/types";

export const fetchComments = async (threadId: string, page = 1, limit = 10) => {
  const response = await apiClient.get<CommentResponse[]>(
    `/comments/${threadId}`,
    {
      params: {
        page,
        limit,
      },
    },
  );
  return response.data;
};

export const createComment = async (threadId: string, content: string) => {
    const response = await apiClient.post(`/comments/${threadId}`, {
      content,
    });
    return response.data;
};

export const toggleLikeComment = async (commentId: string): Promise<ToggleLikeResponse> => {
    const response = await apiClient.post<ToggleLikeResponse>(`/comments/${commentId}/like`);
    return response.data;
}

export const deleteComment = async (commentId: string) => {
    const response = await apiClient.delete(`/comments/${commentId}`);
    return response.data;
}

export const editComment = async (commentId: string, content: string) => {
    const response = await apiClient.put(`/comments/${commentId}`, {
      content,
    });
    return response.data;
}

export const replyToComment = async (commentId: string, content: string) => {
    const response = await apiClient.post(`/comments/${commentId}/reply`, {
      content,
    });
    return response.data;
}

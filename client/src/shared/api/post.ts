import type { MediaResponse } from "../types/mediaResponseTypes";
import { apiClient } from "./apiClient";

export const VISIBILITY_VALUES = {
  PUBLIC: "public",
  PRIVATE: "private",
  FRIENDS: "friends",
  GROUP: "group",
} as const;

// TypeScript-тип
export type Visibility =
  (typeof VISIBILITY_VALUES)[keyof typeof VISIBILITY_VALUES];

export interface Author {
  id: string;
  username: string;
  avatarUrl: string | null;
  slug: string | null;
}

export interface Post {
  id: string;
  content: string;
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
  date: string;
  author: Author;
  media: MediaResponse[] | null;
}

export interface ToggleLikeResponse {
  postId: string;
  likeCount: number;
  isLikedByCurrentUser: boolean;
}

export interface PostsResponse {
  posts: Post[];
}

export interface FetchPostsParams {
  authorId?: string | null;
  page?: number;
  limit?: number;
}

export interface CreatePostPayload {
  content?: string;
  visibility?: Visibility;
  mediaIds?: string[];
}

export interface CreatePostResponse {
  message: string;
}

export const fetchPosts = async ({
  authorId = null,
  page = 1,
  limit = 10,
}: FetchPostsParams = {}): Promise<Post[]> => {
  const authorIdParam = authorId ? `/author/${authorId}` : "";
  const response = await apiClient.get<Post[]>(
    `/posts${authorIdParam}?page=${page}&limit=${limit}`,
  );

  return response.data;
};

export const createPost = async (
  payload: CreatePostPayload,
): Promise<CreatePostResponse> => {
  const response = await apiClient.post<CreatePostResponse>("/posts", payload);

  return response.data;
};

export const toggleLikePost = async (
  postId: string,
): Promise<ToggleLikeResponse> => {
  const response = await apiClient.post<ToggleLikeResponse>(
    `/posts/${postId}/like`,
  );
  return response.data;
};

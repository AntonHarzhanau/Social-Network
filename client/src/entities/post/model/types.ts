import type { MediaResponse } from "@/entities/media/model/types";

export const VISIBILITY_VALUES = {
  PUBLIC: "public",
  PRIVATE: "private",
  FRIENDS: "friends",
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

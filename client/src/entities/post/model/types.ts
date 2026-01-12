import type { MediaResponse } from "@/entities/media/model/types";
import type { UserPreview } from "@/entities/user/model/types";

export const VISIBILITY_VALUES = {
  PUBLIC: "public",
  PRIVATE: "private",
  FRIENDS: "friends",
} as const;

// TypeScript-тип
export type Visibility =
  (typeof VISIBILITY_VALUES)[keyof typeof VISIBILITY_VALUES];

export interface Post {
  id: string;
  content: string;
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
  date: string;
  author: UserPreview;
  commentThreadId: string;
  media: MediaResponse[] | null;
  wallId: string;
  publicationId: string;
  actorId?: string | null;
}

export interface ToggleLikePostResponse {
  id: string;
  likeCount: number;
  isLikedByCurrentUser: boolean;
}

export interface PostsQueryResponse {
  posts: Post[];
}

export interface PostMutationResponse {
  id: string;
}

export interface FetchPostsParams {
  wallId?: string | null;
  page?: number;
  limit?: number;
}

export interface CreatePostPayload {
  content?: string;
  visibility?: Visibility;
  mediaIds?: string[];
}

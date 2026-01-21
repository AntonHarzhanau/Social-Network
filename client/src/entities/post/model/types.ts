import type { MediaPreview } from "@/entities/media/model/types";
import type { UserPreview } from "@/entities/user/model/types";

export const VISIBILITY_VALUES = {
  PUBLIC: "public",
  PRIVATE: "private",
  FRIENDS: "friends",
} as const;

// TypeScript-тип
export type Visibility =
  (typeof VISIBILITY_VALUES)[keyof typeof VISIBILITY_VALUES];

export type WallOwner = {
  id: string;
  type: "user" | "group";
  name: string;
  avatarUrl: string | null;
  wallId: string;
};

export interface Post {
  id: string;
  wallId: string;
  wallOwner: WallOwner;

  author: UserPreview;
  content: string;
  commentThreadId: string;

  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;

  createdAt: string;
  media: MediaPreview[] | null;

  kind: "original" | "repost";
  //   originalPostId: string | null;
  canDelete: boolean;
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

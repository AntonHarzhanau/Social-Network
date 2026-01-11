import type { UserPreview } from "@/entities/user/model/types";

export type CommentResponse = {
  id: string;
  content: string;
  author: UserPreview;
  createdAt: string;
  likeCount: number;
  replyCount: number;
  likedByCurrentUser: boolean;
};

export type ToggleLikeResponse = {
    commentId: string,
    likeCount: number,
    isLikedByCurrentUser: boolean
}

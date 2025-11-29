import { apiClient } from "./apiClient";

export type MediaType = "image" | "video" | "audio" | "document" | "other";

export interface Author {
  id: string;
  username: string;
  avatarUrl: string | null;
}

export interface PostMedia {
  id: string;
  url: string;
  type: MediaType;
}

export interface Post {
  id: string;
  author: Author;
  content: string;
  date: string;
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
  media: PostMedia[];
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
  page?: number;
  limit?: number;
}

export const fetchPosts = async ({
  page = 1,
  limit = 10,
}: FetchPostsParams = {}): Promise<Post[]> => {
  const response = await apiClient.get<PostsResponse>(
    `/posts?page=${page}&limit=${limit}`,
  );

  return response.data.posts;
};

export const toggleLikePost = async (
  postId: string,
): Promise<ToggleLikeResponse> => {
  const response = await apiClient.post(`/posts/${postId}/like`);
  return response.data;
};

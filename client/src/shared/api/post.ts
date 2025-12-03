import { apiClient } from "./apiClient";

export type MediaType = "image" | "video" | "audio" | "document" | "other";
export type Visibility = "public" | "private" | "friends"| "group";

export interface Author {
  id: string;
  username: string;
  avatarUrl: string | null;
}

export interface PostMedia {
  id: string;
  url: string;
  type: MediaType;
  createdAt: string;
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

export interface CreatePostPayload {
    content?: string;
    visibility?: Visibility;
    mediaIds?: string[];
}

export interface CreatePostResponse {
    message: string;
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

export const createPost = async (
    payload: CreatePostPayload,
): Promise<CreatePostResponse> => {
    const response = await apiClient.post<CreatePostResponse>(
        "/posts",
        payload,
    );
    
    return response.data;
}

export const toggleLikePost = async (
  postId: string,
): Promise<ToggleLikeResponse> => {
  const response = await apiClient.post<ToggleLikeResponse>(`/posts/${postId}/like`);
  return response.data;
};

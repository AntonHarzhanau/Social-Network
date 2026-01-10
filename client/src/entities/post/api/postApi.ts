import { apiClient } from "@/shared/api/apiClient";
import type {
  CreatePostPayload,
  CreatePostResponse,
  FetchPostsParams,
  Post,
  ToggleLikeResponse,
} from "@/entities/post/model/types";

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

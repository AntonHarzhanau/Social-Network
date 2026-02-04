import { apiClient } from "@/shared/api/apiClient";
import type {
  CreatePostPayload,
  FetchPostsParams,
  Post,
  PostMutationResponse,
} from "@/entities/post/model/types";

export const postApi = {
  async fetchPosts({
    wallId = null,
    page = 1,
    limit = 10,
    filter = "all",
  }: FetchPostsParams = {}) {
    const wallIdParam = wallId ? `/wall/${wallId}` : "";
    const response = await apiClient.get<Post[]>(
      `/posts${wallIdParam}?page=${page}&limit=${limit}&filter=${filter}`,
    );
    return response.data;
  },

  async createPost(payload: CreatePostPayload, wallId: string) {
    if (!wallId) throw new Error("Wall ID is required to create a post.");
    const response = await apiClient.post<PostMutationResponse>(
      `/posts/${wallId}`,
      payload,
    );

    return response.data;
  },

  async toggleLikePost(postId: string) {
    const response = await apiClient.post<PostMutationResponse>(
      `/posts/${postId}/like`,
    );
    return response.data;
  },

  async fetchPostById(postId: string) {
    const res = await apiClient.get<Post>(`/posts/${postId}`);
    return res.data;
  },

  async deletePost(postId: string) {
    const response = await apiClient.delete<PostMutationResponse>(
      `/posts/${postId}`,
    );
    return response.data;
  },
};

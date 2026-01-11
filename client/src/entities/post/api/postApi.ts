import { apiClient } from "@/shared/api/apiClient";
import type {
  CreatePostPayload,
  FetchPostsParams,
  Post,
  PostMutationResponse,
} from "@/entities/post/model/types";

export const postApi = {
  async fetchPosts({
    authorId = null,
    page = 1,
    limit = 10,
  }: FetchPostsParams = {}) {
    const authorIdParam = authorId ? `/author/${authorId}` : "";
    const response = await apiClient.get<Post[]>(
      `/posts${authorIdParam}?page=${page}&limit=${limit}`,
    );
    console.log("Fetched posts:", response.data);
    return response.data;
  },

  async createPost(payload: CreatePostPayload) {
    const response = await apiClient.post<PostMutationResponse>(
      "/posts",
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

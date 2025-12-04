import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPost,
  type CreatePostPayload,
  type Visibility,
} from "../api/post";
import { POSTS_QUERY_KEY } from "./useInfinitePosts";

export interface CreatePostFormValues {
  content?: string;
  visibility: Visibility;
  mediaIds?: string[];
}

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CreatePostFormValues) => {
      const { content, visibility, mediaIds } = values;

      const payload: CreatePostPayload = {
        content: content,
        visibility,
        mediaIds,
      };

      return createPost(payload);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });
};

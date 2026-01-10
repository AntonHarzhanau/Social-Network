import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/entities/post/api/postApi";
import { postKeys } from "@/entities/post/model/queryKeys";
import type { CreatePostPayload, Visibility } from "@/entities/post/model/types";

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
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
};

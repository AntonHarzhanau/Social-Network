import { postApi } from "@/entities/post/api/postApi";
import { postKeys } from "@/entities/post/model/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export function useToggleLikePost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => {
      return postApi.toggleLikePost(postId);
    },

    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

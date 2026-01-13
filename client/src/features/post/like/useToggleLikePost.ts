import { postApi } from "@/entities/post/api/postApi";
import { syncPostByIdInCache } from "@/entities/post/model/syncPost";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export function useToggleLikePost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => {
      return postApi.toggleLikePost(postId);
    },

    onSuccess: async (res) => {
      await syncPostByIdInCache(qc, res.id);
    },
  });
}

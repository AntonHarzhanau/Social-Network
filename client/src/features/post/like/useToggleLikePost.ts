import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  toggleLikePost,
} from "@/entities/post/api/postApi";
import { postKeys } from "@/entities/post/model/queryKeys";
import { patchPostInInfinite } from "@/entities/post/model/patchPostInfinite";
import type { Post, ToggleLikeResponse } from "@/entities/post/model/types";


export const useToggleLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => toggleLikePost(postId),

    onSuccess: (data: ToggleLikeResponse) => {
      queryClient.setQueriesData<InfiniteData<Post[]>>(
        { queryKey: postKeys.lists() },
        (old) =>
          patchPostInInfinite(old, data.postId, (p) => ({
            ...p,
            likeCount: data.likeCount,
            isLikedByCurrentUser: data.isLikedByCurrentUser,
          })),
      );
    },
  });
};

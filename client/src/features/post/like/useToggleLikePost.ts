import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  toggleLikePost,
  type Post,
  type ToggleLikeResponse,
} from "@/entities/post/api/postApi";
import { postKeys } from "@/entities/post/model/queryKeys";
import { patchPostInInfinite } from "@/entities/post/model/patchPostInfinite";


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

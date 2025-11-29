import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  toggleLikePost,
  type Post,
  type ToggleLikeResponse,
} from "../api/post";
import { POSTS_QUERY_KEY } from "./useInfinitePosts";

export const useToggleLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => toggleLikePost(postId),

    onSuccess: (data: ToggleLikeResponse) => {
      queryClient.setQueryData<InfiniteData<Post[]>>(
        POSTS_QUERY_KEY,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) =>
              page.map((post) =>
                post.id === data.postId
                  ? {
                      ...post,
                      likeCount: data.likeCount,
                      isLikedByCurrentUser: data.isLikedByCurrentUser,
                    }
                  : post,
              ),
            ),
          };
        },
      );
    },
  });
};

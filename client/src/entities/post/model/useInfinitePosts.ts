import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPosts, type Post } from "../api/postApi";
import { postKeys } from "./queryKeys";

export const POSTS_QUERY_KEY = "posts";
export const useInfinitePosts = (
  limit = 10,
  authorId: string | null = null,
) => {

  const query = useInfiniteQuery<Post[]>({
    queryKey: postKeys.list({ authorId, limit }),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchPosts({
        authorId,
        page: pageParam as number,
        limit,
      }),

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) {
        return undefined;
      }
      return allPages.length + 1;
    },
  });

  const posts = query.data?.pages.flatMap((page) => page) ?? [];

  return { ...query, posts };
};

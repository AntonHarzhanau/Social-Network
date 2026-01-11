import { useInfiniteQuery } from "@tanstack/react-query";
import type { Post } from "./types";
import { postKeys } from "./queryKeys";
import { postApi } from "../api/postApi";

export function useInfinitePosts(params?: { authorId?: string | null; limit?: number }) {
  const limit = params?.limit ?? 10;
  const authorId = params?.authorId ?? null;

  const query = useInfiniteQuery<Post[]>({
    queryKey: postKeys.list({ authorId, limit }),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      postApi.fetchPosts({
        authorId,
        page: pageParam as number,
        limit,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined;
      return allPages.length + 1;
    },
  });

  const posts = query.data?.pages.flatMap((p) => p) ?? [];
  return { ...query, posts };
}

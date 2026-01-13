import { useInfiniteQuery } from "@tanstack/react-query";
import type { Post } from "./types";
import { postKeys } from "./queryKeys";
import { postApi } from "../api/postApi";

export function useInfinitePosts(params?: {
  wallId?: string | null;
  limit?: number;
}) {
  const limit = params?.limit ?? 10;
  const wallId = params?.wallId ?? null;

  const queryKey =
    wallId === null
      ? postKeys.infinite({ scope: "mixed", limit })
      : postKeys.infinite({ scope: "wall", wallId, limit });

  const query = useInfiniteQuery<Post[]>({
    queryKey,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      postApi.fetchPosts({
        wallId,
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

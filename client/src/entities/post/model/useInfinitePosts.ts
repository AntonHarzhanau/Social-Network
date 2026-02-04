import { useInfiniteQuery } from "@tanstack/react-query";
import type { Post } from "./types";
import { postKeys } from "./queryKeys";
import { postApi } from "../api/postApi";
import type { PostFilterType } from "@/features/post/post-filter/model/usePostFilterStore";

export function useInfinitePosts(params?: {
  wallId?: string | null;
  limit?: number;
  filter?: PostFilterType;
}) {
  const limit = params?.limit ?? 10;
  const wallId = params?.wallId ?? null;
  const filter = params?.filter ?? "all";

  const queryKey =
    wallId === null
      ? postKeys.infinite({ scope: "mixed", limit, filter })
      : postKeys.infinite({ scope: "wall", wallId, limit, filter });

  const query = useInfiniteQuery<Post[]>({
    queryKey,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      postApi.fetchPosts({
        wallId,
        page: pageParam as number,
        limit,
        filter,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined;
      return allPages.length + 1;
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const posts = query.data?.pages.flatMap((p) => p) ?? [];
  return { ...query, posts };
}

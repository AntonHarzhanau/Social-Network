import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPosts, type Post } from "../api/postApi";
import { useEffect, useRef } from "react";
import { postKeys } from "./queryKeys";

export const POSTS_QUERY_KEY = "posts";
export const useInfinitePosts = (
  limit = 10,
  authorId: string | null = null,
) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (!query.hasNextPage) return;

    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (query.isFetchingNextPage) return;
        query.fetchNextPage();
      },
      { threshold: 0, rootMargin: "200px" },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [query.hasNextPage, query.fetchNextPage, query.isFetchingNextPage]);

  const posts = query.data?.pages.flatMap((page) => page) ?? [];

  return { ...query, posts, loadMoreRef };
};

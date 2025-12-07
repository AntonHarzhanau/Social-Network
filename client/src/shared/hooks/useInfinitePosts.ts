import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPosts, type Post } from "../api/post";
import { useEffect, useRef } from "react";  

export const POSTS_QUERY_KEY = ["posts"] as const;

export const useInfinitePosts = (limit = 10, authorId: string | null = null) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const query = useInfiniteQuery<Post[]>({
    queryKey: POSTS_QUERY_KEY,
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
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          query.fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
      observer.disconnect();
    };
  }, [query.hasNextPage, query.fetchNextPage]);

  const posts = query.data?.pages.flatMap((page) => page) ?? [];

  return { ...query, posts, loadMoreRef };
};

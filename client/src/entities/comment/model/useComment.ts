import { useInfiniteQuery } from "@tanstack/react-query";
import type { CommentResponse } from "./types";
import { fetchComments } from "../api/commentApi";

export const COMMENT_QUERY_KEY = "comments";

export const useComments = (threadId: string, limit = 10) => {
  const query = useInfiniteQuery<CommentResponse[]>({
    queryKey: [COMMENT_QUERY_KEY, threadId],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) =>
      fetchComments(threadId, pageParam as number, limit),

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) {
        return undefined;
      }
      return allPages.length + 1;
    },
  });

  const comments = query.data?.pages.flatMap((page) => page) ?? [];

  return { ...query, comments };
};

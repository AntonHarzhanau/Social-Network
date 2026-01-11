import { useCallback } from "react";
import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import type { CreatePostPayload, Post } from "./types";
import { postKeys } from "./queryKeys";
import { removePostFromInfinite } from "./postCache";
import { fetchAndInsertCreatedPost, syncPostByIdInCache } from "./syncPost";
import { postApi } from "../api/postApi";

export function useCreatePost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePostPayload) => postApi.createPost(payload),
    onSuccess: async (res) => {
      await fetchAndInsertCreatedPost(qc, res.id);
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postApi.deletePost(postId),
    onSuccess: (_res, postId) => {
      qc.setQueriesData<InfiniteData<Post[]>>(
        { queryKey: postKeys.lists() },
        (old) => removePostFromInfinite(old, postId),
      );

      qc.removeQueries({ queryKey: postKeys.detail(postId), exact: true });
    },
  });
}

export function useSyncPostInCache() {
  const qc = useQueryClient();

  return useCallback(
    (postId: string) => syncPostByIdInCache(qc, postId),
    [qc],
  );
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreatePostPayload } from "./types";
import { postKeys } from "./queryKeys";
import { postApi } from "../api/postApi";

type CreatePostVars = {
  wallId: string;
  payload: CreatePostPayload;
};

export function useCreatePost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, wallId }: CreatePostVars) => {
      if (!wallId) throw new Error("wallId is required");
      return postApi.createPost(payload, wallId);
    },
    onSuccess: async (res) => {
      qc.invalidateQueries({ queryKey: postKeys.detail(res.id), exact: true });

      await qc.invalidateQueries({
        queryKey: postKeys.lists(),
        refetchType: "active",
      });
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postApi.deletePost(postId),
    onSuccess: async (_res, postId) => {
      qc.removeQueries({ queryKey: postKeys.detail(postId), exact: true });

      await qc.invalidateQueries({
        queryKey: postKeys.lists(),
        refetchType: "active",
      });
    },
  });
}

export function useToggleLikePost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postApi.toggleLikePost(postId),
    onSuccess: async (_res, postId) => {
      qc.invalidateQueries({ queryKey: postKeys.detail(postId), exact: true });

      await qc.invalidateQueries({
        queryKey: postKeys.lists(),
        refetchType: "active",
      });
    },
  });
}

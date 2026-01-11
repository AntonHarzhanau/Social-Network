import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  deleteComment,
  editComment,
  replyToComment,
  toggleLikeComment,
} from "../api/commentApi";
import { commentsKey, commentRepliesKey } from "./commentQuetyKeys";
import { useSyncPostInCache } from "@/entities/post/model/usePostMutations";

function invalidateComments(
  qc: ReturnType<typeof useQueryClient>,
  threadId: string,
) {
  return qc.invalidateQueries({ queryKey: commentsKey(threadId) });
}

export function useCreateCommentMutation(threadId: string, postId?: string) {
  const qc = useQueryClient();
  const syncPost = useSyncPostInCache();

  return useMutation({
    mutationFn: (content: string) => createComment(threadId, content),
    onSuccess: async () => {
      invalidateComments(qc, threadId);
        if (postId) {
            await syncPost(postId);
        }
    },
  });
}

export function useEditCommentMutation(threadId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { commentId: string; content: string }) =>
      editComment(vars.commentId, vars.content),
    onSuccess: () => invalidateComments(qc, threadId),
  });
}

export function useDeleteCommentMutation(threadId: string, postId: string) {
  const qc = useQueryClient();
  const syncPost = useSyncPostInCache();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: async () => {
      invalidateComments(qc, threadId);
      await syncPost(postId);
    },
  });
}

export function useToggleLikeCommentMutation(threadId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => toggleLikeComment(commentId),
    onSuccess: () => invalidateComments(qc, threadId),
  });
}

export function useReplyToCommentMutation(threadId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { commentId: string; content: string }) =>
      replyToComment(vars.commentId, vars.content),

    onSuccess: (_data, vars) => {
      invalidateComments(qc, threadId);
      qc.invalidateQueries({ queryKey: commentRepliesKey(vars.commentId) });
    },
  });
}

import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  addMembers,
  changeMemberRole,
  createChat,
  removeMember,
  type CreateChatPayload,
} from "../../api/chat";
import { chatKeys } from "../queryKeys";
import type { ChatMember } from "../types";

export function useCreateChatMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateChatPayload) => createChat(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chatKeys.all });
    },
  });
}

export function useRemoveMemberMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      chatId,
      userId,
    }: {
      chatId: string;
      userId?: string;
    }) => {
      if (!userId) throw new Error("Not authenticated");
      await removeMember(chatId, userId);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: chatKeys.members(vars.chatId) });
      qc.invalidateQueries({ queryKey: chatKeys.all });
    },
  });
}

export function useAddMemberMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      chatId,
      userIds,
    }: {
      chatId: string;
      userIds?: string[];
    }) => {
      if (!userIds) throw new Error("Not authenticated");
      await addMembers(chatId, userIds);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: chatKeys.members(vars.chatId) });
      qc.invalidateQueries({ queryKey: chatKeys.all });
    },
  });
}

export function useChangeMemberRoleMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (p: {
      chatId: string;
      userId: string;
      newRole: "admin" | "member";
    }) => {
      await changeMemberRole(p.chatId, p.userId, p.newRole);
    },

    onMutate: async ({ chatId, userId, newRole }) => {
      const key = chatKeys.members(chatId);

      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<InfiniteData<ChatMember[]>>(key);

      qc.setQueryData<InfiniteData<ChatMember[]>>(key, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) =>
            page.map((m) => (m.id === userId ? { ...m, role: newRole } : m)),
          ),
        };
      });

      return { key, prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(ctx.key, ctx.prev);
    },

    onSettled: (_data, _err, vars) => {
      qc.invalidateQueries({ queryKey: chatKeys.members(vars.chatId) });
      qc.invalidateQueries({ queryKey: chatKeys.all });
    },
  });
}

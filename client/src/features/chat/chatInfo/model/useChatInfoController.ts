import { useMemo, useState } from "react";
import { useInfiniteScrollSentinel } from "@/shared/hooks/useInfiniteScrollSentinel";
import type { Chat, ChatMemberRole } from "@/entities/chat/model/types";

import type { ChatPermissions, PendingRoleChange } from "./types";
import { sessionStore } from "@/entities/session/model/sessionStore";
import {
  useChangeMemberRoleMutation,
  useRemoveMemberMutation,
} from "@/entities/chat/model/hooks/useChatMutation";
import { useChatMembers } from "@/entities/chat/model/hooks/useChatMembers";

export function useChatInfoController(chat: Chat, search: string) {
  const userId = sessionStore((s) => s.user?.id);

  const removeMembers = useRemoveMemberMutation();
  const changeRole = useChangeMemberRoleMutation();

  const membersQuery = useChatMembers({ chatId: chat.id, search });

  const sentinelRef = useInfiniteScrollSentinel({
    enabled: !membersQuery.isLoading && !membersQuery.isError,
    hasNextPage: membersQuery.hasNextPage,
    isFetchingNextPage: membersQuery.isFetchingNextPage,
    fetchNextPage: membersQuery.fetchNextPage,
  });

  const currentUserRole = chat.currentUserRole;

  const perms: ChatPermissions = useMemo(() => {
    const canAddMembers =
      currentUserRole === "owner" || currentUserRole === "admin";

    const canRemove = (targetId: string, targetRole: ChatMemberRole) => {
      if (!userId) return false;
      if (targetId === userId) return false;
      if (targetRole === "owner") return false;
      if (currentUserRole === "owner") return true;
      if (currentUserRole === "admin") return targetRole === "member";
      return false;
    };

    const canChangeRoleFor = (targetId: string, targetRole: ChatMemberRole) => {
      if (!userId) return false;
      if (targetId === userId) return false;
      if (targetRole === "owner") return false;
      if (currentUserRole === "owner") return true;
      if (currentUserRole === "admin") return true;
      return false;
    };

    return { canAddMembers, canRemove, canChangeRoleFor };
  }, [currentUserRole, userId]);

  const [pendingRoleChange, setPendingRoleChange] =
    useState<PendingRoleChange | null>(null);

  return {
    members: membersQuery.data,
    sentinelRef,

    perms,

    removePending: removeMembers.isPending,
    changeRolePending: changeRole.isPending,

    removeMember: (memberId: string) =>
      removeMembers.mutate({ chatId: chat.id, userId: memberId }),

    requestRoleChange: (p: PendingRoleChange) => setPendingRoleChange(p),
    cancelRoleChange: () => setPendingRoleChange(null),
    confirmRoleChange: async (p: PendingRoleChange) => {
      await changeRole.mutateAsync({
        chatId: chat.id,
        userId: p.userId,
        newRole: p.to,
      });
      setPendingRoleChange(null);
    },

    pendingRoleChange,
  };
}

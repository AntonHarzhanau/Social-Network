import {
  useMutation,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from "@tanstack/react-query";

import type { Group, GroupVisibility, MemberRole, MemberStatus } from "./types";
import { groupKeys } from "./queryKeys";
import type { MediaPreview } from "@/entities/media/model/types";

import {
  changeGroupMemberRole,
  changeGroupMemberStatus,
  createGroup,
  joinGroup,
  leaveGroup,
  setGroupAvatar,
  setGroupCover,
  updateGroupSettings,
} from "../api/groupApi";

function patchGroupDetail(
  qc: QueryClient,
  groupId: string,
  patch: Partial<Group>,
) {
  qc.setQueryData<Group>(groupKeys.detail(groupId), (old) =>
    old ? { ...old, ...patch } : old,
  );
}

function patchGroupLists(
  qc: QueryClient,
  groupId: string,
  patch: Partial<
    Pick<
      Group,
      | "id"
      | "name"
      | "isMember"
      | "role"
      | "status"
      | "subscribersCount"
      | "currentAvatar"
    >
  >,
) {
  qc.setQueriesData({ queryKey: groupKeys.lists() }, (old) => {
    if (!old) return old;

    if (Array.isArray(old)) {
      return old.map((g: any) => (g?.id === groupId ? { ...g, ...patch } : g));
    }

    const inf = old as InfiniteData<any>;
    if (inf?.pages && Array.isArray(inf.pages)) {
      return {
        ...inf,
        pages: inf.pages.map((page: any[]) =>
          page.map((g: any) => (g?.id === groupId ? { ...g, ...patch } : g)),
        ),
      };
    }

    return old;
  });
}

async function invalidateLists(qc: QueryClient) {
  await qc.invalidateQueries({ queryKey: groupKeys.lists() });
}

async function invalidateGroup(qc: QueryClient, groupId: string) {
  await Promise.all([
    qc.invalidateQueries({ queryKey: groupKeys.detail(groupId) }),
    qc.invalidateQueries({ queryKey: groupKeys.members(groupId) }),
  ]);
}

async function invalidateAllForGroup(qc: QueryClient, groupId: string) {
  await Promise.all([invalidateLists(qc), invalidateGroup(qc, groupId)]);
}

export function useCreateGroupMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createGroup,
    onSuccess: async () => {
      await invalidateLists(qc);
    },
  });
}

export function useJoinGroupMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (v: { groupId: string; visibility?: GroupVisibility }) =>
      joinGroup(v.groupId),

    onMutate: async (vars) => {
      const { groupId } = vars;

      await qc.cancelQueries({ queryKey: groupKeys.detail(groupId) });
      const prev = qc.getQueryData<Group>(groupKeys.detail(groupId));

      const visibility: GroupVisibility | undefined =
        vars.visibility ?? prev?.visibility;

      if (prev) {
        if (visibility === "private") {
          patchGroupDetail(qc, groupId, {
            status: "pending",
            isMember: false,
            role: null,
            wallId: null,
          });
          patchGroupLists(qc, groupId, {
            status: "pending",
            isMember: false,
            role: null,
          });
        } else {
          patchGroupDetail(qc, groupId, {
            status: "accepted",
            isMember: true,
            role: "member",
            subscribersCount: prev.subscribersCount + 1,
          });
          patchGroupLists(qc, groupId, {
            status: "accepted",
            isMember: true,
            role: "member",
            subscribersCount: prev.subscribersCount + 1,
          });
        }
      }

      return { prev };
    },

    onError: (_e, vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(groupKeys.detail(vars.groupId), ctx.prev);
    },

    onSettled: async (_d, _e, vars) => {
      await invalidateAllForGroup(qc, vars.groupId);
    },
  });
}

export function useLeaveGroupMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => leaveGroup(groupId),

    onMutate: async (groupId) => {
      await qc.cancelQueries({ queryKey: groupKeys.detail(groupId) });
      const prev = qc.getQueryData<Group>(groupKeys.detail(groupId));

      if (prev) {
        const wasAcceptedMember = prev.isMember && prev.status === "accepted";
        const nextCount = wasAcceptedMember
          ? Math.max(0, prev.subscribersCount - 1)
          : prev.subscribersCount;

        patchGroupDetail(qc, groupId, {
          status: null,
          isMember: false,
          role: null,
          wallId: null,
          subscribersCount: nextCount,
        });

        patchGroupLists(qc, groupId, {
          status: null,
          isMember: false,
          role: null,
          subscribersCount: nextCount,
        });
      }

      return { prev };
    },

    onError: (_e, groupId, ctx) => {
      if (ctx?.prev) qc.setQueryData(groupKeys.detail(groupId), ctx.prev);
    },

    onSettled: async (_d, _e, groupId) => {
      await invalidateAllForGroup(qc, groupId);
    },
  });
}

export function useChangeGroupMemberRoleMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (v: {
      groupId: string;
      memberId: string;
      newRole: MemberRole;
    }) => changeGroupMemberRole({ memberId: v.memberId, newRole: v.newRole }),

    onSuccess: async (_void, vars) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: groupKeys.members(vars.groupId) }),
        qc.invalidateQueries({ queryKey: groupKeys.detail(vars.groupId) }),
        invalidateLists(qc),
      ]);
    },
  });
}

export function useChangeGroupMemberStatusMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (v: {
      groupId: string;
      memberId: string;
      newStatus: MemberStatus;
    }) =>
      changeGroupMemberStatus({ memberId: v.memberId, newStatus: v.newStatus }),

    onSuccess: async (_void, vars) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: groupKeys.members(vars.groupId) }),
        qc.invalidateQueries({ queryKey: groupKeys.detail(vars.groupId) }),
        invalidateLists(qc),
      ]);
    },
  });
}

export function useSetGroupAvatarMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (v: {
      groupId: string;
      avatarId?: string | null;
      preview?: MediaPreview | null;
    }) => setGroupAvatar(v.groupId, v.avatarId),

    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: groupKeys.detail(vars.groupId) });
      const prev = qc.getQueryData<Group>(groupKeys.detail(vars.groupId));

      if (vars.preview !== undefined) {
        patchGroupDetail(qc, vars.groupId, { currentAvatar: vars.preview });
        patchGroupLists(qc, vars.groupId, {
          currentAvatar: vars.preview ?? null,
        });
      }

      return { prev };
    },

    onError: (_e, vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(groupKeys.detail(vars.groupId), ctx.prev);
    },

    onSettled: async (_d, _e, vars) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: groupKeys.detail(vars.groupId) }),
        invalidateLists(qc),
      ]);
    },
  });
}

export function useSetGroupCoverMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (v: { groupId: string; coverId?: string | null }) =>
      setGroupCover(v.groupId, v.coverId),

    onSettled: async (_d, _e, vars) => {
      await qc.invalidateQueries({ queryKey: groupKeys.detail(vars.groupId) });
    },
  });
}

export function useUpdateGroupSettingsMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (v: {
      groupId: string;
      patch: Partial<Pick<Group, "name" | "description" | "visibility">>;
    }) => updateGroupSettings(v.groupId, v.patch),

    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: groupKeys.detail(vars.groupId) });
      const prev = qc.getQueryData<Group>(groupKeys.detail(vars.groupId));

      patchGroupDetail(qc, vars.groupId, vars.patch);

      if (vars.patch.name) {
        patchGroupLists(qc, vars.groupId, { name: vars.patch.name } as any);
      }

      return { prev };
    },

    onError: (_e, vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(groupKeys.detail(vars.groupId), ctx.prev);
    },

    onSettled: async (_d, _e, vars) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: groupKeys.detail(vars.groupId) }),
        invalidateLists(qc),
      ]);
    },
  });
}

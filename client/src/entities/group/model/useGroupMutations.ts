import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Group, MemberRole, MemberStatus } from "./types";
import { groupKeys } from "./queryKeys";

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

function invalidateLists(qc: ReturnType<typeof useQueryClient>) {
  return qc.invalidateQueries({ queryKey: groupKeys.lists() });
}

function invalidateGroup(
  qc: ReturnType<typeof useQueryClient>,
  groupId: string,
) {
  qc.invalidateQueries({ queryKey: groupKeys.detail(groupId) });
  qc.invalidateQueries({ queryKey: groupKeys.members(groupId) });
}

function invalidateAllForGroup(
  qc: ReturnType<typeof useQueryClient>,
  groupId: string,
) {
  invalidateLists(qc);
  invalidateGroup(qc, groupId);
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
    mutationFn: (groupId: string) => joinGroup(groupId),
    onSuccess: async (_void, groupId) => {
      await invalidateAllForGroup(qc, groupId);
    },
  });
}

export function useLeaveGroupMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => leaveGroup(groupId),
    onSuccess: async (_void, groupId) => {
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
      await qc.invalidateQueries({ queryKey: groupKeys.members(vars.groupId) });
      await qc.invalidateQueries({ queryKey: groupKeys.detail(vars.groupId) });
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
      await qc.invalidateQueries({ queryKey: groupKeys.members(vars.groupId) });
      await qc.invalidateQueries({ queryKey: groupKeys.detail(vars.groupId) });
      await invalidateLists(qc);
    },
  });
}

export function useSetGroupAvatarMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (v: { groupId: string; avatarId?: string | null }) =>
      setGroupAvatar(v.groupId, v.avatarId),
    onSuccess: async (_void, vars) => {
      await qc.invalidateQueries({ queryKey: groupKeys.detail(vars.groupId) });
      await invalidateLists(qc);
    },
  });
}

export function useSetGroupCoverMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (v: { groupId: string; coverId?: string | null }) =>
      setGroupCover(v.groupId, v.coverId),
    onSuccess: async (_void, vars) => {
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
    onSuccess: async (_void, vars) => {
      await qc.invalidateQueries({ queryKey: groupKeys.detail(vars.groupId) });
      await invalidateLists(qc);
    },
  });
}

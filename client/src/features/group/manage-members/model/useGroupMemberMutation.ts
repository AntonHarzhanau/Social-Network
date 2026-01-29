import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MemberRole, MemberStatus } from "@/entities/group/model/types";
import { groupKeys } from "@/entities/group/model/queryKeys";
import {
  changeGroupMemberRole,
  changeGroupMemberStatus,
  rejectGroupJoinRequest,
} from "@/entities/group/api/groupApi";

export function useGroupMemberMutations(groupId: string) {
  const qc = useQueryClient();

  const invalidate = async () => {
    await qc.invalidateQueries({ queryKey: groupKeys.members(groupId) });
    await qc.invalidateQueries({ queryKey: groupKeys.detail(groupId) });
    await qc.invalidateQueries({ queryKey: groupKeys.lists() });
  };

  const changeRoleMut = useMutation({
    mutationFn: (v: { memberId: string; newRole: MemberRole }) =>
      changeGroupMemberRole({ memberId: v.memberId, newRole: v.newRole }),
    onSuccess: invalidate,
  });

  const setStatusMut = useMutation({
    mutationFn: (v: { memberId: string; newStatus: MemberStatus }) =>
      changeGroupMemberStatus({ memberId: v.memberId, newStatus: v.newStatus }),
    onSuccess: invalidate,
  });

  const rejectRequestMut = useMutation({
    mutationFn: (memberId: string) =>
      rejectGroupJoinRequest(memberId),
    onSuccess: invalidate,
  });

  const unbanMut = useMutation({
    mutationFn: async (v: { memberId: string }) => {
      await changeGroupMemberStatus({
        memberId: v.memberId,
        newStatus: "accepted",
      });
      await changeGroupMemberRole({ memberId: v.memberId, newRole: "member" });
    },
    onSuccess: invalidate,
  });

  const isBusy =
    changeRoleMut.isPending ||
    setStatusMut.isPending ||
    rejectRequestMut.isPending ||
    unbanMut.isPending;

  return { changeRoleMut, setStatusMut, rejectRequestMut, unbanMut, isBusy };
}

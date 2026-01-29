import type { GroupMember, MemberRole } from "@/entities/group/model/types";

export function useMemberPermissions(myRole: MemberRole, myUserId: string) {
  const canManage = myRole === "owner" || myRole === "admin";

  const canChangeRole = (target: GroupMember) => {
    if (!canManage) return false;
    if (target.user.id === myUserId) return false;
    if (target.role === "owner") return false;
    return myRole === "owner" || myRole === "admin";
  };

  const canBan = (target: GroupMember) => {
    if (!canManage) return false;
    if (target.user.id === myUserId) return false;
    if (myRole === "owner") return target.role !== "owner";
    if (myRole === "admin") return target.role === "member";
    return false;
  };

  return { canManage, canChangeRole, canBan };
}

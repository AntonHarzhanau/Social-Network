import type { ChatMemberRole } from "@/entities/chat/model/types";

export type PendingRoleChange = {
  userId: string;
  userName: string;
  from: ChatMemberRole;
  to: Exclude<ChatMemberRole, "owner">;
};

export type ChatPermissions = {
  canAddMembers: boolean;
  canChangeRoleFor: (targetId: string, targetRole: ChatMemberRole) => boolean;
  canRemove: (targetId: string, targetRole: ChatMemberRole) => boolean;
};

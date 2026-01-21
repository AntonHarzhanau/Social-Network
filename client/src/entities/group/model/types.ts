import type { MediaPreview } from "@/entities/media/model/types";
import type { UserPreview } from "@/entities/user/model/types";

export type GroupVisibility = "public" | "private";
export type MemberRole = "owner" | "admin" | "member";
export type MemberStatus = "pending" | "accepted" | "banned";

export type Group = {
  id: string;
  name: string;
  groupVisibility: GroupVisibility;
  isMember: boolean;
  role?: MemberRole | null;
  status?: MemberStatus | null;
  description?: string | null;
  subscribersCount: number;
  wallId: string;
  currentAvatar?: MediaPreview | null;
  cover?: MediaPreview | null;
};

export type GroupPreview = Pick<
  Group,
  "id" | "name" | "isMember" | "subscribersCount" | "currentAvatar"
>;

export type GroupMember = {
  id: string;
  user: UserPreview;
  role: MemberRole;
  status?: MemberStatus | null;
};

export type FetchGroupMembersResponse = {
  totalCount: number;
  members: GroupMember[];
};

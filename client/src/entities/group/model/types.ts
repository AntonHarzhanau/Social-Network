import type { MediaPreview } from "@/entities/media/model/types";
import type { UserPreview } from "@/entities/user/model/types";

export type GroupVisibility = "public" | "private";
export type MemberRole = "owner" | "admin" | "member";
export type MemberStatus = "pending" | "accepted" | "banned";
export type GroupFilter = "all" | "subscribed" | "owned";

export type GroupPreview = {
  id: string;
  name: string;
  isMember: boolean;
  role?: MemberRole | null;
  status?: MemberStatus | null;
  subscribersCount: number;
  currentAvatar?: MediaPreview | null;
  visibility: GroupVisibility;
};

export type Group = GroupPreview & {
  description?: string | null;
  wallId?: string | null;
  cover?: MediaPreview | null;
};

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

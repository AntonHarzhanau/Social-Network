import type { MediaPreview } from "@/entities/media/model/types";
import type { UserPreview } from "@/entities/user/model/types";

export type GroupVisibility = "public" | "private";
export type GroupRole = "owner" | "admin" | "member";
export type GroupRequestStatus = "pending" | "accepted" | "banned";

export type Group = {
  id: string;
  name: string;
  groupVisibility: "public" | "private";
  isMember: boolean;
  role?: GroupRole | null;
  status?: GroupRequestStatus | null;
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
  role: GroupRole;
  status?: GroupRequestStatus | null;
};

export type FetchGroupMembersResponse = {
  totalCount: number;
  members: GroupMember[];
};

import type { MediaPreview } from "@/entities/media/model/types";

export type Group = {
  id: string;
  name: string;
  groupVisibility: "public" | "private";
  isMember: boolean;
  role?: string | null;
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

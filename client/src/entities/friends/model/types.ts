import type { UserPreview } from "@/entities/user/model/types";

export type FetchFriendsResponse = {
  friends: UserPreview[];
  totalCount: number;
};

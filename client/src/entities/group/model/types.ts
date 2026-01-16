import type { MediaPreview } from "@/entities/media/model/types";

export type Group = {
  id: string;
  name: string;
  slug?: string | null;
  isMember: boolean;
  currentAvatar?: MediaPreview | null;
  subscribersCount: number;
  wallId: string;
};


// export type GroupDetails = Group & {
//   description?: string | undefined | null;
//   isSubscribedByCurrentUser: boolean;
// };

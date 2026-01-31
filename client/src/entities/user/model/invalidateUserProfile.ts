import type { QueryClient } from "@tanstack/react-query";
import { userKeys } from "@/entities/user/model/queryKeys";

export function invalidateUserProfile(qc: QueryClient, userId: string) {
  qc.invalidateQueries({ queryKey: userKeys.profile(userId) });
  qc.invalidateQueries({ queryKey: userKeys.profileDetails(userId) });
  qc.invalidateQueries({ queryKey: userKeys.avatars(userId) });
  qc.invalidateQueries({ queryKey: userKeys.medias(userId, "image") });
  qc.invalidateQueries({ queryKey: userKeys.medias(userId, "video") });
  qc.invalidateQueries({ queryKey: userKeys.all });
  qc.invalidateQueries({ queryKey: userKeys.myPrivacy() });
}

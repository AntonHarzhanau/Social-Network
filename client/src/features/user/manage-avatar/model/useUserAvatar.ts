import { uploadAvatar } from "@/entities/user/api/userApi";
import { uploadMedia } from "@/entities/media/api/mediaApi";
import { useQueryClient } from "@tanstack/react-query";
import { authActions } from "@/features/auth/model/authActions";

export const useUserAvatar = (userId?: string) => {
  const queryClient = useQueryClient();

  const syncAvatarCache = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] }),
      queryClient.invalidateQueries({ queryKey: ["userAvatars", userId] }),
      authActions.refreshMe(), 
    ]);
  };
  async function uploadNewAvatar(original: File, preview: File) {
    if (!userId) return;

    const originalRes = await uploadMedia(original);
    const previewRes = await uploadMedia(preview);

    await uploadAvatar(originalRes.id, previewRes.id);

    await syncAvatarCache();

    return previewRes;
  }

  async function deleteAvatar() {
    await uploadAvatar(null, null);

    await syncAvatarCache();
  }
  return { uploadNewAvatar, deleteAvatar };
};

import { uploadAvatar } from "@/entities/user/api/userApi";
import { useAuthStore } from "@/features/auth/model/authStore";
import { uploadMedia } from "@/entities/media/api/media";
import { useQueryClient } from "@tanstack/react-query";

export const useUserAvatar = (userId?: string) => {
  const queryClient = useQueryClient();

  const syncAvatarCache = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] }),
      queryClient.invalidateQueries({ queryKey: ["userAvatars", userId] }),
      useAuthStore.getState().checkAuth(),
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

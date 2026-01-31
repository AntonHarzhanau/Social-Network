import { uploadMedia } from "@/entities/media/api/mediaApi";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { authActions } from "@/features/auth/model/authActions";
import { uploadAvatar } from "@/entities/user/api/userApi";
import { userKeys } from "@/entities/user/model/queryKeys";

export const useUserAvatar = (userId?: string) => {
  const qc = useQueryClient();

  const syncAvatarCache = async () => {
    if (userId) {
      await qc.invalidateQueries({ queryKey: userKeys.profile(userId) });
      await qc.invalidateQueries({ queryKey: userKeys.profileDetails(userId) });
      await qc.invalidateQueries({ queryKey: userKeys.avatars(userId) });
    }

    await qc.invalidateQueries({ queryKey: userKeys.all });
    authActions.refreshMe();
  };

  const uploadMutation = useMutation({
    mutationFn: async (vars: { original: File; preview: File }) => {
      if (!userId) throw new Error("userId is required");

      const originalRes = await uploadMedia(vars.original);
      const previewRes = await uploadMedia(vars.preview);

      await uploadAvatar(originalRes.id, previewRes.id);

      return previewRes;
    },
    onSuccess: async () => {
      await syncAvatarCache();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await uploadAvatar(null, null);
    },
    onSuccess: async () => {
      await syncAvatarCache();
    },
  });

  return {
    uploadNewAvatar: (original: File, preview: File) =>
      uploadMutation.mutateAsync({ original, preview }),
    deleteAvatar: () => deleteMutation.mutateAsync(),
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

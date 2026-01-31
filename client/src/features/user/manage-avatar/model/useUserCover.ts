import { uploadMedia } from "@/entities/media/api/mediaApi";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { uploadCover } from "@/entities/user/api/userApi";
import { userKeys } from "@/entities/user/model/queryKeys";

export const useUserCover = (userId?: string) => {
  const qc = useQueryClient();

  const syncAvatarCache = async () => {
    if (userId) {
      await qc.invalidateQueries({ queryKey: userKeys.profile(userId) });
      await qc.invalidateQueries({ queryKey: userKeys.profileDetails(userId) });
    }
  };

  const uploadMutation = useMutation({
    mutationFn: async (vars: { coverImage: File }) => {
      if (!userId) throw new Error("userId is required");

      const cover = await uploadMedia(vars.coverImage);

      await uploadCover(cover.id);

      return cover;
    },
    onSuccess: async () => {
      await syncAvatarCache();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await uploadCover(null);
    },
    onSuccess: async () => {
      await syncAvatarCache();
    },
  });

  return {
    uploadNewCover: (coverImage: File) =>
      uploadMutation.mutateAsync({ coverImage }),
    deleteCover: () => deleteMutation.mutateAsync(),
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

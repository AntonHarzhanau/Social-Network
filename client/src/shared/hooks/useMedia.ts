import { useQuery } from "@tanstack/react-query";
import { fetchMedia } from "@/shared/api/media";

export const useMedia = (mediaId?: string | null) => {
  return useQuery({
    queryKey: ["media", mediaId],
    enabled: !!mediaId,
    queryFn: async () => {
        if (!mediaId) {
            throw new Error("Media ID is required");
        }
        return fetchMedia(mediaId);
    },
    staleTime: Infinity, // TODO: Adjust
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

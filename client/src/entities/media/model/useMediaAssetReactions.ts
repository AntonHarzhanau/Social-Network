import { useQuery } from "@tanstack/react-query";
import { fetchMediaAssetReactions, type MediaAssetReactions } from "@/entities/media/api/media";

export const MEDIA_ASSET_REACTIONS_KEY = "mediaAssetReactions";

export function useMediaAssetReactions(mediaId: string | undefined, enabled: boolean) {
  return useQuery<MediaAssetReactions>({
    queryKey: [MEDIA_ASSET_REACTIONS_KEY, mediaId],
    queryFn: () => fetchMediaAssetReactions(mediaId as string),
    enabled: enabled && !!mediaId,
    staleTime: 30_000,
    // чтобы при свайпе UI не мигал пустым состоянием
    placeholderData: (prev) => prev,
  });
}

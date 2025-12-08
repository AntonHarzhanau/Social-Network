import { useState } from "react";

import {
  UPLOADING_STATUS,
  type MediaItem,
} from "@/shared/types/uploadMediaTypes";
import { uploadMedia } from "../api/media";

interface UsePostMediaUploadParams {
  onMediaIdsChange?: (mediaIds: string[]) => void;
}

export const usePostMediaUpload = ({
  onMediaIdsChange,
}: UsePostMediaUploadParams) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  const isUploadingAny = mediaItems.some(
    (i) => i.status === UPLOADING_STATUS.UPLOADING,
  );

  const syncMediaIds = (items: MediaItem[]) => {
    const ids = items
      .filter((i) => i.status === UPLOADING_STATUS.SUCCESS && i.serverId)
      .map((i) => i.serverId as string);

    onMediaIdsChange?.(ids);
  };

  const uploadSingleFile = async (localId: string, file: File) => {
    try {
      const res = await uploadMedia(file);

      setMediaItems((prev) => {
        const next = prev.map((item) =>
          item.localId === localId
            ? {
                ...item,
                status: UPLOADING_STATUS.SUCCESS,
                serverId: res.id,
                previewUrl: res.url,
                error: undefined,
              }
            : item,
        );
        syncMediaIds(next);
        return next;
      });
    } catch (e) {
      console.error("Upload error", e);
      setMediaItems((prev) =>
        prev.map((item) =>
          item.localId === localId
            ? {
                ...item,
                status: UPLOADING_STATUS.ERROR,
                error: "Error while uploading file",
              }
            : item,
        ),
      );
    }
  };

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;

    const newItems: MediaItem[] = files.map((file) => ({
      localId: crypto.randomUUID(),
      file,
      status: UPLOADING_STATUS.UPLOADING,
    }));

    setMediaItems((prev) => [...prev, ...newItems]);

    newItems.forEach((item) => {
      void uploadSingleFile(item.localId, item.file);
    });
  };

  const resetMedia = () => {
    setMediaItems([]);
    onMediaIdsChange?.([]);
  };

  const handleRemoveMedia = (localId: string) => {
    setMediaItems((prev) => {
      const next = prev.filter((item) => item.localId !== localId);
      syncMediaIds(next);
      return next;
    });
  };

  const handleRetry = (localId: string) => {
    const item = mediaItems.find((i) => i.localId === localId);
    if (!item) return;

    setMediaItems((prev) =>
      prev.map((item) =>
        item.localId === localId
          ? { ...item, status: UPLOADING_STATUS.UPLOADING, error: undefined }
          : item,
      ),
    );
    void uploadSingleFile(localId, item.file);
  };

  return {
    mediaItems,
    isUploadingAny,
    handleFilesSelected,
    handleRemoveMedia,
    handleRetry,
    resetMedia,
  };
};

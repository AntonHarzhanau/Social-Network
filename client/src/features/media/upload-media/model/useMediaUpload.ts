import { useRef, useState } from "react";
import { uploadMedia, deleteMedia } from "@/entities/media/api/mediaApi";
import { UPLOADING_STATUS, type MediaItem } from "@/entities/media/model/types";

type Mode = "multiple" | "single";

interface useMediaUploadParams {
  onMediaIdsChange?: (mediaIds: string[]) => void;
  mode?: Mode;
}

const genId = () => {
  const c = globalThis.crypto as Crypto | undefined;
  return c?.randomUUID
    ? c.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const revokeIfBlob = (url?: string) => {
  if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
};

const safeDeleteMedia = async (serverId: string) => {
  try {
    await deleteMedia(serverId);
  } catch (e) {
    console.warn("deleteMedia failed (ignored):", serverId, e);
  }
};

export const useMediaUpload = ({
  onMediaIdsChange,
  mode = "multiple",
}: useMediaUploadParams) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  const removedIdsRef = useRef(new Set<string>());

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

      if (removedIdsRef.current.has(localId)) {
        void safeDeleteMedia(res.id);
        return;
      }

      setMediaItems((prev) => {
        let oldPreview: string | undefined;

        const next = prev.map((item) => {
          if (item.localId !== localId) return item;

          oldPreview = item.previewUrl;
          return {
            ...item,
            status: UPLOADING_STATUS.SUCCESS,
            serverId: res.id,
            previewUrl: res.url ?? item.previewUrl,
            error: undefined,
          };
        });

        revokeIfBlob(oldPreview);
        syncMediaIds(next);
        return next;
      });
    } catch (e) {
      console.error("Upload error", e);

      if (removedIdsRef.current.has(localId)) return;

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

    const chosen = mode === "single" ? [files[0]] : files;

    const newItems: MediaItem[] = chosen.map((file) => ({
      localId: genId(),
      file,
      status: UPLOADING_STATUS.UPLOADING,
      previewUrl: URL.createObjectURL(file),
    }));

    setMediaItems((prev) => {
      if (mode === "single") {
        prev.forEach((it) => revokeIfBlob(it.previewUrl));
        syncMediaIds([]);
        return newItems;
      }
      return [...prev, ...newItems];
    });

    newItems.forEach((item) => {
      void uploadSingleFile(item.localId, item.file);
    });
  };

  const resetMedia = () => {
    setMediaItems((prev) => {
      prev.forEach((it) => revokeIfBlob(it.previewUrl));
      return [];
    });
    onMediaIdsChange?.([]);
  };

  const handleRemoveMedia = (localId: string) => {
    removedIdsRef.current.add(localId);

    let serverIdToDelete: string | undefined;

    setMediaItems((prev) => {
      const target = prev.find((i) => i.localId === localId);

      revokeIfBlob(target?.previewUrl);
      serverIdToDelete = target?.serverId;

      const next = prev.filter((item) => item.localId !== localId);
      syncMediaIds(next);
      return next;
    });

    if (serverIdToDelete) {
      void safeDeleteMedia(serverIdToDelete);
    }
  };

  const handleRetry = (localId: string) => {
    const item = mediaItems.find((i) => i.localId === localId);
    if (!item) return;

    if (removedIdsRef.current.has(localId)) return;

    setMediaItems((prev) =>
      prev.map((it) =>
        it.localId === localId
          ? { ...it, status: UPLOADING_STATUS.UPLOADING, error: undefined }
          : it,
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

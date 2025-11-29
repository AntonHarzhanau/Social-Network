import { useEffect, useState, useRef, type DragEvent } from "react";
import { uploadMedia, type UploadMediaResponse } from "@/shared/api/media";

export type UploadStatus = "uploading" | "success" | "error";

export type MediaItem = {
  localId: string;
  file: File;
  previewUrl: string;
  status: UploadStatus;
  serverId?: string;
  error?: string;
};

type UsePostMediaUploadParams = {
  maxFiles: number;
  value: string[];                 // текущие mediaIds из формы
  onChange: (ids: string[]) => void;
  onUploadingChange?: (isUploading: boolean) => void;
};

export function usePostMediaUpload({
  maxFiles,
  value,
  onChange,
  onUploadingChange,
}: UsePostMediaUploadParams) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // следим за статусом загрузки
  useEffect(() => {
    const uploading = items.some((i) => i.status === "uploading");
    onUploadingChange?.(uploading);
  }, [items, onUploadingChange]);

  // чистим objectURL при размонтировании
  useEffect(() => {
    return () => {
      items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, [items]);

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const incoming = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (incoming.length === 0) return;

    const availableSlots = maxFiles - value.length;
    const limited = incoming.slice(0, Math.max(availableSlots, 0));
    if (limited.length === 0) return;

    limited.forEach(addFile);
  };

  const addFile = (file: File) => {
    const localId = crypto.randomUUID();
    const previewUrl = URL.createObjectURL(file);

    const newItem: MediaItem = {
      localId,
      file,
      previewUrl,
      status: "uploading",
    };

    setItems((prev) => [...prev, newItem]);
    uploadFile(file, localId);
  };

  const uploadFile = async (file: File, localId: string) => {
    try {
      const res: UploadMediaResponse = await uploadMedia(file);

      setItems((prev) =>
        prev.map((item) =>
          item.localId === localId
            ? { ...item, status: "success", serverId: res.id }
            : item,
        ),
      );

      onChange([...value, res.id]);
    } catch (e) {
      console.error(e);
      setItems((prev) =>
        prev.map((item) =>
          item.localId === localId
            ? {
                ...item,
                status: "error",
                error: "Ошибка загрузки",
              }
            : item,
        ),
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeItem = (localId: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.localId === localId);
      if (item) {
        URL.revokeObjectURL(item.previewUrl);
      }
      const next = prev.filter((i) => i.localId !== localId);

      if (item?.serverId) {
        onChange(value.filter((id) => id !== item.serverId));
      }

      return next;
    });
  };

  const isUploading = items.some((i) => i.status === "uploading");

  return {
    inputRef,
    items,
    isUploading,
    openFileDialog,
    handleInputChange,
    handleDragOver,
    handleDragEnter,
    handleDrop,
    removeItem,
  };
}

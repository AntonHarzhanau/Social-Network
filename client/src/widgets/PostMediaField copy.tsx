// src/features/posts/PostMediaField.tsx
import { useEffect, useRef, useState, type DragEvent } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { uploadMedia, type UploadMediaResponse } from "@/shared/api/media";

type UploadStatus = "uploading" | "success" | "error";

type MediaItem = {
  localId: string;
  file: File;
  previewUrl: string;
  status: UploadStatus;
  serverId?: string;
  error?: string;
};

type PostMediaFieldProps = {
  value: string[]; // массив id с сервера
  onChange: (ids: string[]) => void;
  onUploadingChange?: (isUploading: boolean) => void;
  maxFiles?: number;
};

export function PostMediaField({
  value,
  onChange,
  onUploadingChange,
  maxFiles = 10,
}: PostMediaFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<MediaItem[]>([]);

  // обновляем флаг "что-то грузится"
  useEffect(() => {
    const uploading = items.some((i) => i.status === "uploading");
    onUploadingChange?.(uploading);
  }, [items, onUploadingChange]);

  // чистим objectURL при удалении/размонтировании
  useEffect(() => {
    return () => {
      items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, [items]);

  const handleClick = () => {
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

    limited.forEach((file) => addFile(file));
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

    // сразу запускаем загрузку
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

      // добавляем id в форму
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

  const handleRemove = (localId: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.localId === localId);
      if (item) {
        URL.revokeObjectURL(item.previewUrl);
      }
      const next = prev.filter((i) => i.localId !== localId);

      // если был успешно загружен — убираем его id из формы
      if (item?.serverId) {
        onChange(value.filter((id) => id !== item.serverId));
      }

      return next;
    });
  };

  const isUploading = items.some((i) => i.status === "uploading");

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple
        accept="image/*"
        onChange={handleInputChange}
      />

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-6 text-center text-sm cursor-pointer transition-colors",
          "border-muted-foreground/40 hover:border-primary/60 hover:bg-muted/40",
          isUploading && "border-primary/80 bg-primary/5",
        )}
      >
        <UploadCloud className="h-6 w-6 opacity-80" />
        <div>
          <span>Перетащи сюда изображения</span>{" "}
          <span className="text-muted-foreground">или</span>{" "}
          <span className="text-primary">выбери файл</span>
        </div>
        <p className="text-xs text-muted-foreground">
          До {maxFiles} изображений. Файлы загружаются сразу на сервер.
        </p>
      </div>

      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <div
              key={item.localId}
              className={cn(
                "relative h-20 w-20 overflow-hidden rounded-md border bg-muted",
                item.status === "error" && "border-destructive",
              )}
            >
              <img
                src={item.previewUrl}
                alt={item.file.name}
                className="h-full w-full object-cover"
              />

              {/* статус */}
              {item.status === "uploading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                </div>
              )}
              {item.status === "error" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-[10px] text-red-400 px-1 text-center">
                  Ошибка
                </div>
              )}

              {/* кнопка удаления */}
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute right-1 top-1 h-6 w-6 rounded-full p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(item.localId);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

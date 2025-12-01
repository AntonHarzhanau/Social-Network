// src/features/posts/PostMediaField.tsx
import { UploadCloud } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { PostMediaPreviewItem } from "@/widgets/CreatePostForm/PostMediaPreviewItem";
import { usePostMediaUpload } from "@/shared/hooks/usePostMediaUpload";

type PostMediaFieldProps = {
  value: string[];
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
  const {
    inputRef,
    items,
    isUploading,
    openFileDialog,
    handleInputChange,
    handleDragOver,
    handleDragEnter,
    handleDrop,
    removeItem,
  } = usePostMediaUpload({
    maxFiles,
    value,
    onChange,
    onUploadingChange,
  });

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
        onClick={openFileDialog}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-6 text-center text-sm cursor-pointer transition-colors select-none",
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
            <PostMediaPreviewItem
              key={item.localId}
              item={item}
              onRemove={() => removeItem(item.localId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

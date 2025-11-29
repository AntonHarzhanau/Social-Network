import { Button } from "@/shared/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { MediaItem } from "@/shared/hooks/usePostMediaUpload";

type Props = {
  item: MediaItem;
  onRemove: () => void;
};

export function PostMediaPreviewItem({ item, onRemove }: Props) {
  return (
    <div
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

      <Button
        type="button"
        size="icon"
        variant="destructive"
        className="absolute right-1 top-1 h-6 w-6 rounded-full p-0"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

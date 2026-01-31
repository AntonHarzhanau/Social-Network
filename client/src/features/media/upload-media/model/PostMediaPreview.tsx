import { UPLOADING_STATUS, type MediaItem } from "@/entities/media/model/types";
import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";

interface PostMediaPreviewProps {
  items: MediaItem[];
  onRemove: (localId: string) => void;
  onRetry: (localId: string) => void;
}

export function PostMediaPreview({
  items,
  onRemove,
  onRetry,
}: PostMediaPreviewProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <div
          key={item.localId}
          className="relative w-24 h-24 rounded-lg overflow-hidden border bg-background"
        >
          {/* content */}
          {item.status === UPLOADING_STATUS.SUCCESS && item.previewUrl ? (
            <img
              src={item.previewUrl}
              alt={item.file.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[10px] px-1 text-center gap-1">
              {item.status === UPLOADING_STATUS.UPLOADING && (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              )}
              {item.status === UPLOADING_STATUS.ERROR && (
                <>
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span>Error</span>
                  <button
                    type="button"
                    onClick={() => onRetry(item.localId)}
                    className="underline text-[10px]"
                  >
                    Retry
                  </button>
                </>
              )}
              {item.status === UPLOADING_STATUS.SUCCESS && !item.previewUrl && (
                <span>No preview</span>
              )}
            </div>
          )}

          {/* bottom bar */}
          <div className="absolute bottom-0 left-0 w-full flex items-center justify-between bg-black/60 text-[10px] text-white px-1 py-0.5">
            <span className="truncate" title={item.file.name}>
              {item.file.name}
            </span>
            <span className="flex items-center gap-0.5">
              {item.status === UPLOADING_STATUS.UPLOADING && (
                <Loader2 className="w-3 h-3 animate-spin" />
              )}
              {item.status === UPLOADING_STATUS.SUCCESS && (
                <CheckCircle2 className="w-3 h-3 text-green-400" />
              )}
              {item.status === UPLOADING_STATUS.ERROR && (
                <AlertCircle className="w-3 h-3 text-red-400" />
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.localId)}
            className="absolute top-0 right-0 m-0.5 rounded-full bg-black/70 text-white p-0.5 hover:bg-black"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

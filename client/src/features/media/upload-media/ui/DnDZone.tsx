import { cn } from "@/shared/lib/utils";
import { useId, useMemo, useState, type ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

export type MediaAccept = "image" | "video" | "media";

const ACCEPT_MAP: Record<Exclude<MediaAccept, "media">, string> = {
  image: "image/*",
  video: "video/*",
};

interface DnDZoneProps {
  onFilesSelected: (files: File[]) => void;

  accept?: MediaAccept; // "image" | "video" | "media"
  multiple?: boolean;
  disabled?: boolean;
  className?: string;

  title?: string;
  subtitle?: string;
}

const DnDZone = ({
  onFilesSelected,
  accept = "media",
  multiple = true,
  disabled = false,
  className,
  title = "Drag & drop files here",
  subtitle = "or tap to select",
}: DnDZoneProps) => {
  const zoneId = useId();
  const photoId = useId();
  const videoId = useId();

  const [isDragging, setIsDragging] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(pointer: coarse)").matches ?? false;
  }, []);

  const acceptValue =
    accept === "media" ? "image/*,video/*" : ACCEPT_MAP[accept];

  const emitFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    onFilesSelected(Array.from(files));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    emitFiles(e.currentTarget.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    emitFiles(e.dataTransfer.files);
    e.dataTransfer.clearData();
  };

  const onZoneClick = (e: React.MouseEvent<HTMLLabelElement>) => {
    if (disabled) return;

    if (isMobile && accept === "media") {
      e.preventDefault();
      setPickerOpen(true);
    }
  };

  const onPickedAndClose = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e);
    setPickerOpen(false);
  };

  return (
    <>
      <label
        htmlFor={zoneId}
        className={cn(
          "relative h-52 rounded-2xl flex justify-center items-center border-2 border-dashed cursor-pointer transition text-sm text-center px-4 select-none",
          disabled && "opacity-60 cursor-not-allowed pointer-events-none",
          isDragging
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/40 hover:bg-muted/40",
          className,
        )}
        onClick={onZoneClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="pointer-events-none">
          <div className="font-medium">{title}</div>
          <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
        </div>

        <input
          id={zoneId}
          type="file"
          accept={acceptValue}
          multiple={multiple}
          className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
          onClick={(e) => {
            (e.currentTarget as HTMLInputElement).value = "";
          }}
        />
      </label>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Choose media</DialogTitle>
          </DialogHeader>

          <div className="grid gap-2">
            <label className="relative">
              <Button type="button" className="w-full" variant="secondary">
                Choose photos
              </Button>
              <input
                id={photoId}
                type="file"
                accept="image/*"
                multiple={multiple}
                className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                onChange={onPickedAndClose}
                onClick={(e) => {
                  (e.currentTarget as HTMLInputElement).value = "";
                }}
              />
            </label>

            <label className="relative">
              <Button type="button" className="w-full" variant="secondary">
                Choose videos
              </Button>
              <input
                id={videoId}
                type="file"
                accept="video/*"
                multiple={multiple}
                className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                onChange={onPickedAndClose}
                onClick={(e) => {
                  (e.currentTarget as HTMLInputElement).value = "";
                }}
              />
            </label>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setPickerOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DnDZone;

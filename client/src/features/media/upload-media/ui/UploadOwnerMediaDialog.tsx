import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";

import DnDZone from "@/features/media/upload-media/ui/DnDZone";
import { MediaPreview } from "@/features/media/upload-media/ui/MediaPreview";
import { useMediaUpload } from "@/features/media/upload-media/model/useMediaUpload";
import { mediaBoxKeys, type MediaKind } from "@/widgets/MediaBox/model/keys";

interface UploadOwnerMediaDialogProps {
  label: string; // "Load photos" / "Load videos"
  accept: MediaKind; // "image" | "video"
  multiple?: boolean;

  owner: { kind: "user" | "group"; id: string };

  attachMedias: (mediaIds: string[]) => Promise<unknown>;

  afterAttachInvalidate?: (
    qc: import("@tanstack/react-query").QueryClient,
  ) => void;
}

export const UploadOwnerMediaDialog = ({
  label,
  accept,
  multiple = true,
  owner,
  attachMedias,
  afterAttachInvalidate,
}: UploadOwnerMediaDialogProps) => {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();

  const {
    mediaItems,
    isUploadingAny,
    handleFilesSelected,
    handleRemoveMedia,
    handleRetry,
    resetMedia,
  } = useMediaUpload({
    mode: multiple ? "multiple" : "single",
  });

  const attachMutation = useMutation({
    mutationFn: (ids: string[]) => attachMedias(ids),
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: mediaBoxKeys.list(owner, accept),
      });

      afterAttachInvalidate?.(qc);

      toast.success("Media uploaded successfully", { closeButton: true });
      resetMedia();
      setOpen(false);
    },
    onError: (e) => {
      console.error(e);
      toast.error("Failed to attach media.");
    },
  });

  const mediaIds = mediaItems
    .filter((i) => i.status === "success" && i.serverId)
    .map((i) => i.serverId as string);

  const onSubmit = async () => {
    if (isUploadingAny) {
      toast("Wait until all files are uploaded");
      return;
    }
    if (mediaIds.length === 0) {
      toast("Select file(s) first");
      return;
    }
    await attachMutation.mutateAsync(mediaIds);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1">{label}</Button>
      </DialogTrigger>

      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="mx-auto">{label}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <DnDZone
            onFilesSelected={handleFilesSelected}
            accept={accept}
            multiple={multiple}
            title={
              accept === "image"
                ? "Tap to choose photo(s)"
                : "Tap to choose video(s)"
            }
            subtitle="or drag & drop on desktop"
          />

          <MediaPreview
            items={mediaItems}
            onRemove={handleRemoveMedia}
            onRetry={handleRetry}
          />

          <Button
            type="button"
            onClick={onSubmit}
            disabled={attachMutation.isPending}
          >
            Publish
          </Button>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

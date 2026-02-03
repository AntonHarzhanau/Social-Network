import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DnDZone, {
  type MediaAccept,
} from "../../../media/upload-media/ui/DnDZone";
import { MediaPreview } from "../../../media/upload-media/ui/MediaPreview";
import { useMediaUpload } from "@/features/media/upload-media/model/useMediaUpload";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { FieldGroup } from "@/shared/components/ui/field";
import {
  uploadMediaSchema,
  type UploadMediaPayload,
} from "../model/UploadMediaSchema";
import { useAttachMyMediaMutation } from "@/entities/user/model/useUserMutations";

interface UploadMediaFormProps {
  userId: string;
  onSuccess?: () => void;

  accept: Exclude<MediaAccept, "media">;
}

export const UploadMediaForm = ({
  userId,
  onSuccess,
  accept,
}: UploadMediaFormProps) => {
  const attachMutation = useAttachMyMediaMutation({ myUserId: userId });

  const form = useForm<UploadMediaPayload>({
    resolver: zodResolver(uploadMediaSchema),
    defaultValues: { mediaIds: [] },
  });

  const {
    mediaItems,
    isUploadingAny,
    handleFilesSelected,
    handleRemoveMedia,
    handleRetry,
    resetMedia,
  } = useMediaUpload({
    mode: "single",
    onMediaIdsChange: (mediaIds) => {
      form.setValue("mediaIds", mediaIds, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
  });

  const onSubmit = async (rawvalues: UploadMediaPayload) => {
    if (isUploadingAny) {
      toast("Wait until all files are uploaded");
      return;
    }

    const values = uploadMediaSchema.parse(rawvalues);

    if (!values.mediaIds?.[0]) {
      toast("Select a file first");
      return;
    }

    try {
      await attachMutation.mutateAsync(values.mediaIds);
      toast.success("Media uploaded successfully", { closeButton: true });
      form.reset();
      resetMedia();
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload media. Please try again.");
    }
  };

  const hasSelected = mediaItems.length > 0;

  return (
    <form
      id="upload-user-media-form"
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        {!hasSelected ? (
          <DnDZone
            onFilesSelected={handleFilesSelected}
            accept={accept} // "image" | "video"
            multiple={false}
            title={
              accept === "image"
                ? "Tap to choose a photo"
                : "Tap to choose a video"
            }
            subtitle="or drag & drop on desktop"
          />
        ) : (
          <MediaPreview
            items={mediaItems}
            onRemove={handleRemoveMedia}
            onRetry={handleRetry}
          />
        )}

        <Button
          type="submit"
          form="upload-user-media-form"
          disabled={
            attachMutation.isPending ||
            isUploadingAny ||
            !form.watch("mediaIds")?.[0]
          }
        >
          Publish
        </Button>
      </FieldGroup>
    </form>
  );
};

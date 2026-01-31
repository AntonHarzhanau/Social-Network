import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DnDZone from "../../../media/upload-media/ui/DnDZone";
import { PostMediaPreview } from "../../../media/upload-media/model/PostMediaPreview";
import { usePostMediaUpload } from "@/features/media/upload-media/model/usePostMediaUpload";
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
}

export const UploadMediaForm = ({
  userId,
  onSuccess,
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
  } = usePostMediaUpload({
    onMediaIdsChange: (mediaIds: string[]) => {
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

  return (
    <form
      id="upload-user-media-form"
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <DnDZone onFilesSelected={handleFilesSelected} />

        <PostMediaPreview
          items={mediaItems}
          onRemove={handleRemoveMedia}
          onRetry={handleRetry}
        />

        <Button
          type="submit"
          form="upload-user-media-form"
          disabled={attachMutation.isPending}
        >
          Publish
        </Button>
      </FieldGroup>
    </form>
  );
};

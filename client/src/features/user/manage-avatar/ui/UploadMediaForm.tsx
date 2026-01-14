import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DnDZone from "../../../media/upload-media/ui/DnDZone";
import { PostMediaPreview } from "../../../media/upload-media/model/PostMediaPreview";
import { usePostMediaUpload } from "@/features/media/upload-media/model/usePostMediaUpload";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  FieldGroup,
} from "@/shared/components/ui/field";
import { uploadMediaSchema, type UploadMediaPayload } from "../model/UploadMediaSchema";
import { uploadUserMedia } from "@/entities/user/api/userApi";

interface UploadMediaFormProps {
  userId: string;
  onSuccess?: () => void;
}

export const UploadMediaForm = ({ userId, onSuccess }: UploadMediaFormProps) => {
  
const uploadMedia = async (mediaIds: string[]) => {
    await uploadUserMedia(userId, mediaIds);
}
  const form = useForm<UploadMediaPayload>({
    resolver: zodResolver(uploadMediaSchema),
    defaultValues: {
      mediaIds: [],
    },
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
    if (!userId) {
        toast.error("User ID is missing. Cannot upload media.");
        return;
    }
    
    if (isUploadingAny) {
      toast("Wait until all files are uploaded");
      return;
    }

    const values = uploadMediaSchema.parse(rawvalues);

    try {
      await uploadMedia(values.mediaIds);
      toast.success("Media uploaded successfully", { closeButton: true });
      form.reset();
      resetMedia();
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create post. Please try again.");
    }
  };

  return (
    <form
      id="create-post-form"
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

        <Button type="submit" form="create-post-form">
          Publish
        </Button>
      </FieldGroup>
    </form>
  );
};

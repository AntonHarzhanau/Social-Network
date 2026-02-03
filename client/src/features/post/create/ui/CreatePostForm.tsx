import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/shared/components/ui/textarea";
import { createPostSchema, type CreatePostFormValues } from "../model/schema";
import DnDZone from "../../../media/upload-media/ui/DnDZone";
import { MediaPreview } from "../../../media/upload-media/ui/MediaPreview";
import VisibilitySelector from "./VisibilitySelector";
import { useMediaUpload } from "@/features/media/upload-media/model/useMediaUpload";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { VISIBILITY_VALUES } from "@/entities/post/model/types";
import { useCreatePost } from "@/entities/post/model/usePostMutations";

interface CreatePostFormProps {
  wallId: string;
  onSuccess?: () => void;
}

export const CreatePostForm = ({ wallId, onSuccess }: CreatePostFormProps) => {
  const { mutateAsync: createPost } = useCreatePost();
  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: "",
      visibility: VISIBILITY_VALUES.PUBLIC,
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
  } = useMediaUpload({
    mode: "multiple",
    onMediaIdsChange: (mediaIds) => {
      form.setValue("mediaIds", mediaIds, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
  });

  const onSubmit = async (rawvalues: CreatePostFormValues) => {
    if (!wallId) {
      toast.error("Wall ID is missing. Cannot create post.");
      return;
    }

    if (isUploadingAny) {
      toast("Wait until all files are uploaded");
      return;
    }

    const values = createPostSchema.parse(rawvalues);

    try {
      await createPost({ payload: values, wallId });
      toast.success("Post created successfully", { closeButton: true });
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
        <DnDZone
          onFilesSelected={handleFilesSelected}
          accept="media"
          multiple
        />

        <MediaPreview
          items={mediaItems}
          onRemove={handleRemoveMedia}
          onRetry={handleRetry}
        />
        <Controller
          name="content"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="content">Content</FieldLabel>
              <Textarea
                {...field}
                id="content"
                placeholder="What's on your mind?"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <VisibilitySelector name="visibility" control={form.control} />
        <Button type="submit" form="create-post-form">
          Publish
        </Button>
      </FieldGroup>
    </form>
  );
};

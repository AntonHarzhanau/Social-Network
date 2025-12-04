import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shared/components/ui/form";
import { createPostSchema, type CreatePostFormValues } from "./schema";
import { VISIBILITY_VALUES } from "@/shared/api/post";
import DnDZone from "./DnDZone";
import { PostMediaPreview } from "./PostMediaPreview";
import VisibilitySelector from "./VisibilitySelector";
import { usePostMediaUpload } from "@/shared/hooks/usePostMediaUpload";
import { toast } from "sonner";

export const CreatePostForm = () => {
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
  } = usePostMediaUpload({
    onMediaIdsChange: (mediaIds: string[]) => {
      form.setValue("mediaIds", mediaIds, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
  });

  const onSubmit = (rawvalues: CreatePostFormValues) => {
    if (isUploadingAny) {
      toast("Event has been created", {
        description: "Sunday, December 03, 2023 at 9:00 AM",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      console.warn("Wait until all files are uploaded");
      return;
    }

    const values = createPostSchema.parse(rawvalues);
    console.log("Create post payload:", values);
  };

  return (
    <Form {...form}>
      <form
        id="create-post-form"
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <DnDZone onFilesSelected={handleFilesSelected} />

        <PostMediaPreview
          items={mediaItems}
          onRemove={handleRemoveMedia}
          onRetry={handleRetry}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What's on your mind?"
                  className="resize-y min-h-20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <VisibilitySelector name="visibility" control={form.control} />
      </form>
    </Form>
  );
};

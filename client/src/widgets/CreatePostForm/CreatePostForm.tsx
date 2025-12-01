// CreatePostForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Textarea } from "@/shared/components/ui/textarea";
import { PostMediaField } from "@/widgets/CreatePostForm/PostMediaField";
import { useCreatePost } from "@/shared/hooks/useCreatePost";
import type { Visibility } from "@/shared/api/post";

const postSchema = z
  .object({
    content: z.string().max(3000).optional(),

    visibility: z.enum(["public", "friends", "private", "group"]),

    mediaIds: z.array(z.string()),
  })
  .refine(
    (data) =>
      (data.content && data.content.trim().length > 0) ||
      data.mediaIds.length > 0,
    {
      message: "Either text or at least one image is required",
      path: ["content"],
    },
  );

export type PostFormValues = z.infer<typeof postSchema>;

type Props = {
  onSuccess?: () => void;
};

export function CreatePostForm({ onSuccess }: Props) {
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
      visibility: "public",
      mediaIds: [],
    },
  });

  const createPostMutation = useCreatePost();
  const isSubmitting = createPostMutation.isPending;

  const onSubmit = async (values: PostFormValues) => {
    if (isUploading) return;

    await createPostMutation.mutateAsync({
      content: values.content,
      visibility: values.visibility as Visibility,
      mediaIds: values.mediaIds,
    });

    form.reset();
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post Text</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What are you thinking about?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* visibility*/}

        <FormField
          control={form.control}
          name="mediaIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <PostMediaField
                  value={field.value ?? []} // string[]
                  onChange={field.onChange} // (ids: string[]) => void
                  onUploadingChange={setIsUploading}
                  maxFiles={10}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isUploading && (
          <p className="text-xs text-muted-foreground">
            Uploading images, please wait…
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isSubmitting || isUploading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isUploading
              ? "Waiting for media upload…"
              : isSubmitting
                ? "Publishing..."
                : "Publish"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

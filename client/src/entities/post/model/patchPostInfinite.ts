import type { InfiniteData } from "@tanstack/react-query";
import type { Post } from "./types";

export function patchPostInInfinite(
  old: InfiniteData<Post[]> | undefined,
  postId: string,
  patch: (post: Post) => Post,
): InfiniteData<Post[]> | undefined {
  if (!old) return old;

  let changed = false;

  const pages = old.pages.map((page) =>
    page.map((post) => {
      if (post.id !== postId) return post;

      changed = true;
      return patch(post);
    }),
  );

  return changed ? { ...old, pages} : old;
}

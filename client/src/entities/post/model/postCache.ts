import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { Post } from "./types";
import { postKeys } from "./queryKeys";

export function replacePostInInfinite(
  old: InfiniteData<Post[]> | undefined,
  postId: string,
  next: Post,
): InfiniteData<Post[]> | undefined {
  if (!old) return old;

  let changed = false;

  const pages = old.pages.map((page) =>
    page.map((p) => {
      if (p.id !== postId) return p;
      changed = true;
      return next;
    }),
  );

  return changed ? { ...old, pages } : old;
}

export function removePostFromInfinite(
  old: InfiniteData<Post[]> | undefined,
  postId: string,
): InfiniteData<Post[]> | undefined {
  if (!old) return old;

  let changed = false;

  const pages = old.pages.map((page) => {
    const filtered = page.filter((p) => p.id !== postId);
    if (filtered.length !== page.length) changed = true;
    return filtered;
  });

  return changed ? { ...old, pages } : old;
}

function prependToFirstPage(
  old: InfiniteData<Post[]> | undefined,
  post: Post,
  limit: number,
): InfiniteData<Post[]> {
  if (!old) {
    return { pageParams: [1], pages: [[post]] };
  }

  const already = old.pages.some((page) =>
    page.some((pagePost) => pagePost.id === post.id),
  );
  if (already) return old;

  const first = old.pages[0] ?? [];
  const nextFirst = [post, ...first].slice(0, limit);

  return { ...old, pages: [nextFirst, ...old.pages.slice(1)] };
}

export function insertPostIntoCachedLists(qc: QueryClient, post: Post) {
  const entries = qc.getQueriesData<InfiniteData<Post[]>>({
    queryKey: postKeys.lists(),
  });

  for (const [qk, data] of entries) {
    const key = qk as readonly unknown[];

    // ["posts","lists","mixed",{limit}]
    if (key[2] === "mixed") {
      const limit = (key[3] as { limit: number } | undefined)?.limit ?? 10;
      qc.setQueryData<InfiniteData<Post[]>>(qk, (old) =>
        prependToFirstPage(old ?? data ?? undefined, post, limit),
      );
      continue;
    }

    // ["posts","lists","wall", wallId, {limit}]
    if (key[2] === "wall") {
      const wallId = String(key[3]);
      if (wallId !== post.wallId) continue;

      const limit = (key[4] as { limit: number } | undefined)?.limit ?? 10;
      qc.setQueryData<InfiniteData<Post[]>>(qk, (old) =>
        prependToFirstPage(old ?? data ?? undefined, post, limit),
      );
      continue;
    }
  }
}

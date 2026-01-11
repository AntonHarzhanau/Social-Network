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

  const first = old.pages[0] ?? [];
  const already = first.some((p) => p.id === post.id) || old.pages.some((pg) => pg.some((p) => p.id === post.id));
  if (already) return old;

  const nextFirst = [post, ...first].slice(0, limit);

  return {
    ...old,
    pages: [nextFirst, ...old.pages.slice(1)],
  };
}


export function insertPostIntoCachedLists(qc: QueryClient, post: Post) {
  const entries = qc.getQueriesData<InfiniteData<Post[]>>({ queryKey: postKeys.lists() });

  for (const [qk, data] of entries) {
    // qk: ["posts","lists",{authorId,limit}]
    const params = (qk as unknown as readonly any[])[2] as { authorId: string | null; limit: number } | undefined;
    const authorId = params?.authorId ?? null;
    const limit = params?.limit ?? 10;

    const matchesAuthor = authorId === null || authorId === post.author.id;
    if (!matchesAuthor) continue;

    qc.setQueryData<InfiniteData<Post[]>>(qk, (old) => prependToFirstPage(old ?? data ?? undefined, post, limit));
  }
}

import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { Group, GroupPreview } from "./types";
import { groupKeys } from "./queryKeys";

function patchArrayList(
  old: unknown,
  groupId: string,
  patch: Partial<GroupPreview>,
) {
  if (!old) return old;

  if (Array.isArray(old)) {
    return old.map((g: any) => (g?.id === groupId ? { ...g, ...patch } : g));
  }

  const inf = old as InfiniteData<any>;
  if (inf?.pages && Array.isArray(inf.pages)) {
    return {
      ...inf,
      pages: inf.pages.map((page: any[]) =>
        page.map((g: any) => (g?.id === groupId ? { ...g, ...patch } : g)),
      ),
    };
  }

  return old;
}

export function patchGroupDetail(
  qc: QueryClient,
  groupId: string,
  patch: Partial<Group>,
) {
  qc.setQueryData<Group>(groupKeys.detail(groupId), (old) =>
    old ? { ...old, ...patch } : old,
  );
}

export function patchGroupLists(
  qc: QueryClient,
  groupId: string,
  patch: Partial<GroupPreview>,
) {
  qc.setQueriesData({ queryKey: groupKeys.lists() }, (old) =>
    patchArrayList(old, groupId, patch),
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { mediaBoxKeys } from "./model/keys";
import type { MediaBoxSource } from "./model/types";
import type { MediaKind } from "./model/keys";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  source: MediaBoxSource;
  type: MediaKind;
  title?: string;

  pageSize?: number;
};

export function MediaBoxShowAllDialog({
  open,
  onOpenChange,
  source,
  type,
  title = "All media",
  pageSize = 36,
}: Props) {
  const q = useQuery({
    queryKey: mediaBoxKeys.list(source.owner, type),
    queryFn: ({ signal }) => source.fetchMedias(type, signal),
    enabled: open && source.canView,
    staleTime: 60_000,
  });

  const [visibleCount, setVisibleCount] = useState(pageSize);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) setVisibleCount(pageSize);
  }, [open, pageSize]);

  const all = q.data ?? [];
  const visible = useMemo(
    () => all.slice(0, visibleCount),
    [all, visibleCount],
  );

  useEffect(() => {
    if (!open) return;
    if (!sentinelRef.current) return;
    if (!all.length) return;

    const el = sentinelRef.current;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;

        setVisibleCount((prev) => Math.min(prev + pageSize, all.length));
      },
      { root: null, threshold: 0 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [open, all.length, pageSize]);

  const onOpenViewer = (idx: number) => {
    if (!source.onOpenViewer) return;
    source.onOpenViewer({ type, medias: all, initialIndex: idx });
  };

  const gridClass = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-2";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90dvh] max-w-3xl flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-auto">
          {q.isPending ? (
            <div className={gridClass}>
              {Array.from({ length: 24 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-md" />
              ))}
            </div>
          ) : q.isError ? (
            <div className="p-4 text-sm text-muted-foreground">
              Failed to load.
            </div>
          ) : all.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              No media yet.
            </div>
          ) : (
            <div className={gridClass}>
              {visible.map((m, idx) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onOpenViewer(idx)}
                  className="relative aspect-square w-full overflow-hidden rounded-md"
                >
                  <img
                    src={m.url}
                    alt=""
                    loading="lazy"
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}

              <div ref={sentinelRef} className="h-1 w-full col-span-full" />

              {visibleCount < all.length ? (
                <div className="col-span-full p-2 text-xs text-muted-foreground">
                  Loading more…
                </div>
              ) : null}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

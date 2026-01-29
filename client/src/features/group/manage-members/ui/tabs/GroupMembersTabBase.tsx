import type * as React from "react";
import SearchInput from "@/shared/components/SearchInput";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useInfiniteScrollSentinel } from "@/shared/hooks/useInfiniteScrollSentinel";
import { cn } from "@/shared/lib/utils";

type Props<T> = {
  searchId: string;
  placeholder: string;
  search: string;
  onSearchChange: (v: string) => void;

  countLabel: string;
  count: number;

  items: T[];
  renderItem: (item: T) => React.ReactNode;
  getKey?: (item: T) => string;

  isLoading?: boolean;
  isError?: boolean;
  emptyText: string;
  errorText?: string;

  enableInfinite?: boolean;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  rootMargin?: string;

  scrollClassName?: string;
};

export function GroupMembersTabBase<T>(props: Props<T>) {
  const {
    searchId,
    placeholder,
    search,
    onSearchChange,

    countLabel,
    count,

    items,
    renderItem,
    getKey,

    isLoading = false,
    isError = false,
    emptyText,
    errorText = "Failed to load",

    enableInfinite = false,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage = false,
    rootMargin = "200px",

    scrollClassName = "h-96",
  } = props;

  const sentinelRef = useInfiniteScrollSentinel({
    enabled:
      enableInfinite &&
      hasNextPage === true &&
      !isLoading &&
      !isError &&
      !!fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage: fetchNextPage ?? (() => {}),
    rootMargin,
  });

  return (
    <div>
      <SearchInput
        searchId={searchId}
        placeholder={placeholder}
        value={search}
        onChange={onSearchChange}
      />

      <div className="mt-2 text-xs text-muted-foreground">
        {countLabel}: {count}
      </div>

      <ScrollArea className={cn("mt-4", scrollClassName)}>
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : isError ? (
            <div className="text-sm text-destructive">{errorText}</div>
          ) : items.length === 0 ? (
            <div className="text-sm text-muted-foreground">{emptyText}</div>
          ) : (
            items.map((item) => (
              <div key={getKey ? getKey(item) : (item as any).id}>
                {renderItem(item)}
              </div>
            ))
          )}

          {enableInfinite ? <div ref={sentinelRef} className="h-8" /> : null}

          {enableInfinite && hasNextPage && isFetchingNextPage ? (
            <div className="text-xs text-muted-foreground">Loading more…</div>
          ) : null}
        </div>
      </ScrollArea>
    </div>
  );
}

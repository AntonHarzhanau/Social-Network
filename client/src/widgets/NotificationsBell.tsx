import { useMemo, useState } from "react";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Bell } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { useInfiniteScrollSentinel } from "@/shared/hooks/useInfiniteScrollSentinel";

import {
  fetchNotifications,
  fetchUnreadCount,
} from "@/entities/notification/api/notificationsApi";
import { notificationsKeys } from "@/entities/notification/model/queryKeys";
import {
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "@/entities/notification/model/useNotificationMutations";
import type { NotificationDTO } from "@/entities/notification/model/types";

const LIMIT = 10;

export function NotificationsBell({ enabled = true }: { enabled?: boolean }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const markOneRead = useMarkNotificationAsReadMutation();
  const markAllRead = useMarkAllNotificationsAsReadMutation();

  // badge
  const unreadQuery = useQuery({
    queryKey: notificationsKeys.unreadCount,
    queryFn: fetchUnreadCount,
    enabled,
    initialData: { unreadCount: 0 },
  });

  // list
  const notificationsQuery = useInfiniteQuery<NotificationDTO[]>({
    queryKey: notificationsKeys.all,
    enabled: enabled && open,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchNotifications(pageParam as number, LIMIT),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < LIMIT ? undefined : allPages.length + 1,
  });

  const items = useMemo(
    () => notificationsQuery.data?.pages.flatMap((p) => p) ?? [],
    [notificationsQuery.data],
  );

  const unreadCount = unreadQuery.data?.unreadCount ?? 0;
  const badgeText = unreadCount > 99 ? "99+" : String(unreadCount);

  const sentinelRef = useInfiniteScrollSentinel({
    enabled: open,
    hasNextPage: notificationsQuery.hasNextPage,
    isFetchingNextPage: notificationsQuery.isFetchingNextPage,
    fetchNextPage: () => notificationsQuery.fetchNextPage(),
    rootMargin: "250px",
  });

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          qc.invalidateQueries({ queryKey: notificationsKeys.unreadCount });
          qc.invalidateQueries({ queryKey: notificationsKeys.all });
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="p-2 relative"
          aria-label="Notifications"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span
              className="
                absolute -top-1 -right-1
                min-w-5 h-5 px-1
                rounded-full
                text-[11px] leading-5 text-center
                bg-destructive text-destructive-foreground
              "
            >
              {badgeText}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-96 p-0">
        <div className="px-3 py-2 border-b flex items-center justify-between gap-2">
          <div>
            <div className="font-medium">Notifications</div>
            <div className="text-sm text-muted-foreground">
              Unread: {unreadCount}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={unreadCount === 0 || markAllRead.isPending}
            onClick={() => markAllRead.mutate()}
          >
            Mark all read
          </Button>
        </div>

        <ScrollArea className="h-96">
          <div className="p-2 space-y-1">
            {notificationsQuery.isLoading && (
              <div className="p-3 text-sm text-muted-foreground">Loading…</div>
            )}

            {notificationsQuery.isError && (
              <div className="p-3 text-sm text-destructive">
                Failed to load notifications
              </div>
            )}

            {!notificationsQuery.isLoading && items.length === 0 && (
              <div className="p-3 text-sm text-muted-foreground">
                No notifications yet
              </div>
            )}

            {items.map((n) => (
              <button
                key={n.id}
                className="w-full text-left rounded-md px-3 py-2 hover:bg-accent transition"
                onClick={() => {
                  // mark-as-read (только если не прочитано)
                  if (!n.readAt && !markOneRead.isPending) {
                    markOneRead.mutate({ id: n.id });
                  }

                  // тут: навигация на target если нужно
                  setOpen(false);
                }}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={[
                      "mt-2 h-2 w-2 rounded-full",
                      n.readAt ? "bg-muted" : "bg-primary",
                    ].join(" ")}
                  />
                  <div className="min-w-0">
                    <div className="text-sm">{n.text}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </button>
            ))}

            <div ref={sentinelRef} className="h-1" />

            {notificationsQuery.isFetchingNextPage && (
              <div className="p-3 text-sm text-muted-foreground">
                Loading more…
              </div>
            )}

            {!notificationsQuery.hasNextPage && items.length > 0 && (
              <div className="p-3 text-xs text-muted-foreground">
                End of list
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

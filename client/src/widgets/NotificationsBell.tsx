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
import type { NotificationDTO } from "@/entities/notification/model/types";
import { normalizeNotification } from "@/entities/notification/model/types";

import {
  useAckAllNotificationsMutation,
  useAckNotificationMutation,
} from "@/entities/notification/model/useNotificationMutations";

import { NotificationItem } from "@/entities/notification/ui/NotificationItem";
import { getHandler } from "@/entities/notification/lib/handlers/registry";
import { useFriendsFilterStore } from "@/entities/friends/model/useFriendsFilterStore";
import { useLocation } from "react-router-dom";

const LIMIT = 10;

export function NotificationsBell({ enabled = true }: { enabled?: boolean }) {
  const qc = useQueryClient();
  const location = useLocation();
  const setFriendsFilter = useFriendsFilterStore((s) => s.setFilter);

  const [open, setOpen] = useState(false);

  const ackOne = useAckNotificationMutation();
  const ackAll = useAckAllNotificationsMutation();

  // badge unread notifications
  const unreadQuery = useQuery({
    queryKey: notificationsKeys.unread,
    queryFn: fetchUnreadCount,
    enabled,
    placeholderData: { unreadCount: 0 },
    refetchOnMount: "always",
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });

  const notificationsQuery = useInfiniteQuery<NotificationDTO[]>({
    queryKey: notificationsKeys.list,
    enabled: enabled && open,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchNotifications(pageParam as number, LIMIT),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < LIMIT ? undefined : allPages.length + 1,
  });

  const items = useMemo(
    () =>
      (notificationsQuery.data?.pages.flatMap((p) => p) ?? []).map(
        normalizeNotification,
      ),
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
          qc.invalidateQueries({ queryKey: notificationsKeys.unread });
          qc.invalidateQueries({ queryKey: notificationsKeys.list });
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
            disabled={unreadCount === 0 || ackAll.isPending}
            onClick={() => {
              ackAll.mutate(undefined, {
                onSettled: () => {
                  qc.invalidateQueries({ queryKey: notificationsKeys.unread });
                  qc.invalidateQueries({ queryKey: notificationsKeys.list });
                },
              });
              setOpen(false);
            }}
          >
            Clear all
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

            {items.map((n) => {
              const handler = getHandler(n.type);

              const ctx = {
                qc,
                location,
                ackOne,
                setFriendsFilter,
              } as const;

              const to = handler.getLink(n as any);

              return (
                <NotificationItem
                  key={n.id}
                  n={n}
                  to={to}
                  showTime
                  onClick={() => {
                    handler.onClick?.(n as any, ctx);

                    ackOne.mutate(
                      { id: n.id },
                      {
                        onSettled: () => {
                          qc.invalidateQueries({
                            queryKey: notificationsKeys.unread,
                          });
                        },
                      },
                    );

                    setOpen(false);
                  }}
                />
              );
            })}

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

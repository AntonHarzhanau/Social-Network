import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type UnreadCountResponse,
} from "@/entities/notification/api/notificationsApi";
import { notificationsKeys } from "./queryKeys";

import { type NotificationDTO } from "./types";

type Rollback = {
  prevList?: InfiniteData<NotificationDTO[]>;
  prevUnread?: UnreadCountResponse;
};

function markOneReadInInfinite(
  old: InfiniteData<NotificationDTO[]> | undefined,
  id: string,
) {
  if (!old) return old;

  const now = new Date().toISOString();
  return {
    ...old,
    pages: old.pages.map((page) =>
      page.map((n) => (n.id === id ? { ...n, readAt: n.readAt ?? now } : n)),
    ),
  };
}

function markAllReadInInfinite(
  old: InfiniteData<NotificationDTO[]> | undefined,
) {
  if (!old) return old;

  const now = new Date().toISOString();
  return {
    ...old,
    pages: old.pages.map((page) =>
      page.map((n) => (n.readAt ? n : { ...n, readAt: now })),
    ),
  };
}

function countUnreadInInfinite(
  old: InfiniteData<NotificationDTO[]> | undefined,
) {
  if (!old) return 0;
  return old.pages.reduce(
    (acc, page) => acc + page.filter((n) => !n.readAt).length,
    0,
  );
}

export function useMarkNotificationAsReadMutation() {
  const qc = useQueryClient();

  return useMutation<void, Error, { id: string }, Rollback>({
    mutationFn: ({ id }) => markNotificationAsRead(id),

    onMutate: async ({ id }) => {
      await Promise.all([
        qc.cancelQueries({ queryKey: notificationsKeys.all }),
        qc.cancelQueries({ queryKey: notificationsKeys.unreadCount }),
      ]);

      const prevList = qc.getQueryData<InfiniteData<NotificationDTO[]>>(
        notificationsKeys.all,
      );
      const prevUnread = qc.getQueryData<UnreadCountResponse>(
        notificationsKeys.unreadCount,
      );

      qc.setQueryData<InfiniteData<NotificationDTO[]>>(
        notificationsKeys.all,
        (old) => markOneReadInInfinite(old, id),
      );

      if (prevUnread) {
        qc.setQueryData<UnreadCountResponse>(notificationsKeys.unreadCount, {
          unreadCount: Math.max(0, prevUnread.unreadCount - 1),
        });
      } else {
        const nextList = qc.getQueryData<InfiniteData<NotificationDTO[]>>(
          notificationsKeys.all,
        );
        qc.setQueryData<UnreadCountResponse>(notificationsKeys.unreadCount, {
          unreadCount: countUnreadInInfinite(nextList),
        });
      }

      return { prevList, prevUnread };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prevList)
        qc.setQueryData<InfiniteData<NotificationDTO[]>>(
          notificationsKeys.all,
          ctx.prevList,
        );
      if (ctx?.prevUnread)
        qc.setQueryData(notificationsKeys.unreadCount, ctx.prevUnread);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: notificationsKeys.unreadCount });
      qc.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });
}

export function useMarkAllNotificationsAsReadMutation() {
  const qc = useQueryClient();

  return useMutation<void, Error, void, Rollback>({
    mutationFn: () => markAllNotificationsAsRead(),

    onMutate: async () => {
      await Promise.all([
        qc.cancelQueries({ queryKey: notificationsKeys.all }),
        qc.cancelQueries({ queryKey: notificationsKeys.unreadCount }),
      ]);

      const prevList = qc.getQueryData<InfiniteData<NotificationDTO[]>>(
        notificationsKeys.all,
      );
      const prevUnread = qc.getQueryData<UnreadCountResponse>(
        notificationsKeys.unreadCount,
      );

      qc.setQueryData<InfiniteData<NotificationDTO[]>>(
        notificationsKeys.all,
        (old) => markAllReadInInfinite(old),
      );

      qc.setQueryData<UnreadCountResponse>(notificationsKeys.unreadCount, {
        unreadCount: 0,
      });

      return { prevList, prevUnread };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prevList) qc.setQueryData(notificationsKeys.all, ctx.prevList);
      if (ctx?.prevUnread)
        qc.setQueryData(notificationsKeys.unreadCount, ctx.prevUnread);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: notificationsKeys.unreadCount });
      qc.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });
}

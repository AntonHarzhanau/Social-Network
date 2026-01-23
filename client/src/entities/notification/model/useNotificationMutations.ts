import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type UnreadCountResponse,
} from "../api/notificationsApi";
import type { NotificationDTO } from "./types";
import { notificationsKeys } from "./queryKeys";

type Rollback = {
  prevList?: InfiniteData<NotificationDTO[]>;
  prevUnread?: UnreadCountResponse;
};

function removeOne(
  old: InfiniteData<NotificationDTO[]> | undefined,
  id: string,
) {
  if (!old) return old;
  return {
    ...old,
    pages: old.pages.map((p) => p.filter((n) => n.id !== id)),
  };
}

function removeAll(old: InfiniteData<NotificationDTO[]> | undefined) {
  if (!old) return old;
  return { ...old, pages: old.pages.map(() => []) };
}

export function useAckNotificationMutation() {
  const qc = useQueryClient();

  return useMutation<void, Error, { id: string }, Rollback>({
    mutationFn: ({ id }) => markNotificationAsRead(id),

    onMutate: async ({ id }) => {
      await Promise.all([
        qc.cancelQueries({ queryKey: notificationsKeys.list }),
        qc.cancelQueries({ queryKey: notificationsKeys.unread }),
      ]);

      const prevList = qc.getQueryData<InfiniteData<NotificationDTO[]>>(
        notificationsKeys.list,
      );
      const prevUnread = qc.getQueryData<UnreadCountResponse>(
        notificationsKeys.unread,
      );

      qc.setQueryData<InfiniteData<NotificationDTO[]>>(
        notificationsKeys.list,
        (old) => removeOne(old, id),
      );

      if (prevUnread) {
        qc.setQueryData<UnreadCountResponse>(notificationsKeys.unread, {
          unreadCount: Math.max(0, prevUnread.unreadCount - 1),
        });
      }

      return { prevList, prevUnread };
    },

    onError: (_e, _v, ctx) => {
      if (ctx?.prevList) qc.setQueryData(notificationsKeys.list, ctx.prevList);
      if (ctx?.prevUnread)
        qc.setQueryData(notificationsKeys.unread, ctx.prevUnread);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: notificationsKeys.unread });
    },
  });
}

export function useAckAllNotificationsMutation() {
  const qc = useQueryClient();

  return useMutation<void, Error, void, Rollback>({
    mutationFn: () => markAllNotificationsAsRead(),

    onMutate: async () => {
      await Promise.all([
        qc.cancelQueries({ queryKey: notificationsKeys.list }),
        qc.cancelQueries({ queryKey: notificationsKeys.unread }),
      ]);

      const prevList = qc.getQueryData<InfiniteData<NotificationDTO[]>>(
        notificationsKeys.list,
      );
      const prevUnread = qc.getQueryData<UnreadCountResponse>(
        notificationsKeys.unread,
      );

      qc.setQueryData<InfiniteData<NotificationDTO[]>>(
        notificationsKeys.list,
        (old) => removeAll(old),
      );
      qc.setQueryData<UnreadCountResponse>(notificationsKeys.unread, {
        unreadCount: 0,
      });

      return { prevList, prevUnread };
    },

    onError: (_e, _v, ctx) => {
      if (ctx?.prevList) qc.setQueryData(notificationsKeys.list, ctx.prevList);
      if (ctx?.prevUnread)
        qc.setQueryData(notificationsKeys.unread, ctx.prevUnread);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: notificationsKeys.unread });
      qc.invalidateQueries({ queryKey: notificationsKeys.list });
    },
  });
}

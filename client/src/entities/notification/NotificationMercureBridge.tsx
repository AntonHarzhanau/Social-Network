import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";

import { useMercure } from "@/shared/hooks/useMercure";
import { topics } from "@/shared/constants/topics";
import { sessionStore } from "@/entities/session/model/sessionStore";

import { notificationsKeys } from "@/entities/notification/model/queryKeys";
import { useAckNotificationMutation } from "@/entities/notification/model/useNotificationMutations";
import type {
  NotificationDTO,
  NotificationEvent,
} from "@/entities/notification/model/types";
import { normalizeNotification } from "@/entities/notification/model/types";

import { NotificationItem } from "@/entities/notification/ui/NotificationItem";
import { getHandler } from "@/entities/notification/lib/handlers/registry";
import { useFriendsFilterStore } from "@/entities/friends/model/useFriendsFilterStore";

function upsertInfinite(
  old: InfiniteData<NotificationDTO[]> | undefined,
  n: NotificationDTO,
): InfiniteData<NotificationDTO[]> | undefined {
  if (!old) return old;
  const pages = old.pages.map((p) => p.filter((x) => x.id !== n.id));
  pages[0] = [n, ...pages[0]];
  return { ...old, pages };
}

function removeInfinite(
  old: InfiniteData<NotificationDTO[]> | undefined,
  id: string,
): InfiniteData<NotificationDTO[]> | undefined {
  if (!old) return old;
  return { ...old, pages: old.pages.map((p) => p.filter((x) => x.id !== id)) };
}

export function NotificationsMercureBridge() {
  const userId = sessionStore((s) => s.user?.id);
  const qc = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const setFriendsFilter = useFriendsFilterStore((s) => s.setFilter);

  const ackOne = useAckNotificationMutation();

  const onMessage = useCallback(
    (ev: NotificationEvent) => {
      qc.setQueryData(notificationsKeys.unread, {
        unreadCount: ev.unreadCount,
      });

      if (ev.action === "cleared") {
        qc.setQueryData(notificationsKeys.list, undefined);
        return;
      }

      if (ev.action === "deleted") {
        const id = (ev.notification as any)?.id;
        if (typeof id === "string") {
          qc.setQueryData<InfiniteData<NotificationDTO[]>>(
            notificationsKeys.list,
            (old) => removeInfinite(old, id),
          );
        } else {
          qc.invalidateQueries({ queryKey: notificationsKeys.list });
        }
        return;
      }

      const raw = ev.notification as NotificationDTO | null;
      if (!raw?.id) return;

      const n = normalizeNotification(raw);
      const handler = getHandler(n.type);

      const ctx = { qc, location, ackOne, setFriendsFilter };
      const decision = handler.onReceive(n as any, ev, ctx);

      if (decision.autoAck) {
        ackOne.mutate({ id: n.id });
        return;
      }

      qc.setQueryData<InfiniteData<NotificationDTO[]>>(
        notificationsKeys.list,
        (old) => upsertInfinite(old, raw),
      );

      const showToast = decision.showToast ?? true;
      if (!showToast) return;

      const to = handler.getLink(n as any);

      toast.custom((t) => (
        <NotificationItem
          n={n}
          to={null} // <- В toast НЕ Link
          variant="toast"
          onClick={() => {
            handler.onClick?.(n as any, ctx);
            ackOne.mutate({ id: n.id });

            if (to) navigate(to); // <- навигация программно
            toast.dismiss(t);
          }}
        />
      ));
    },
    [qc, location, navigate, ackOne, setFriendsFilter],
  );

  useMercure<NotificationEvent>({
    topic: userId ? topics.userNotifications(userId) : "",
    enable: !!userId,
    onMessage,
  });

  return null;
}

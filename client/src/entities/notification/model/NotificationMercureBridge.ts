import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { topics, useMercure } from "@/shared/hooks/useMercure";
import { sessionStore } from "@/entities/session/model/sessionStore";
import { toast } from "sonner";
import { friendsQueryKeys } from "@/entities/friends/model/queryKeys";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { useFriendsFilterStore } from "@/entities/friends/model/useFriendsFilterStore";
import type { MyFriendsStats } from "@/entities/friends/model/types";

type NotificationDTO = {
  id: string;
  type: string;
  text: string;
  target: any;
  payload: any;
  createdAt: string;
  readAt: string | null;
};

type NotificationCreatedEvent = {
  type: "notification_created";
  notification: NotificationDTO;
  unreadCount?: number;
};

const FRIEND_REQUEST_TYPE = "FRIEND_REQUEST_CREATED";
const FRIEND_REQUEST_ACCEPTED_TYPE = "FRIEND_REQUEST_ACCEPTED";

export function NotificationsMercureBridge() {
  const userId = sessionStore((s) => s.user?.id);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setFilter = useFriendsFilterStore((s) => s.setFilter);

  const openReceivedRequests = () => {
    setFilter("received");
    navigate(ROUTES.FRIENDS);
  };

  const openAllFriends = () => {
    setFilter("all");
    navigate(ROUTES.FRIENDS);
  };

  const onMessage = useCallback(
    (payload: NotificationCreatedEvent) => {
      if (typeof payload.unreadCount === "number") {
        queryClient.setQueryData(["notifications", "unread-count"], {
          unreadCount: payload.unreadCount,
        });
      }

      // ВАЖНО: если пришла заявка в друзья — обновляем friends stats (badge)
      if (payload.notification.type === FRIEND_REQUEST_TYPE) {
        queryClient.setQueryData<MyFriendsStats>(
          friendsQueryKeys.stats.me(),
          (old) => {
            const base = old ?? {
              total: 0,
              sentRequests: 0,
              receivedRequests: 0,
            };
            return { ...base, receivedRequests: base.receivedRequests + 1 };
          },
        );

        // toast с action, ведущим на страницу заявок
        toast(payload.notification.text, {
          action: { label: "Open", onClick: openReceivedRequests },
        });

        return;
      }

      if (payload.notification.type === FRIEND_REQUEST_ACCEPTED_TYPE) {
        queryClient.setQueryData<MyFriendsStats>(
          friendsQueryKeys.stats.me(),
          (old) => {
            const base = old ?? {
              total: 0,
              sentRequests: 0,
              receivedRequests: 0,
            };
            return { ...base, total: base.total + 1 };
          },
        );

        // toast с action, ведущим на страницу всех друзей
        toast(payload.notification.text, {
          action: { label: "Open", onClick: openAllFriends },
        });

        return;
      }

      // другие уведомления — обычный toast
      toast(payload.notification.text);
    },
    [queryClient, userId, navigate, setFilter],
  );

  useMercure<NotificationCreatedEvent>({
    topic: userId ? topics.userNotifications(userId) : "",
    enable: !!userId,
    onMessage,
  });

  return null;
}

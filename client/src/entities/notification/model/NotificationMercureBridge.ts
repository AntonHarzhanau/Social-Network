import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useMercure } from "@/shared/hooks/useMercure";
import { sessionStore } from "@/entities/session/model/sessionStore";
import { toast } from "sonner";
import { friendsQueryKeys } from "@/entities/friends/model/queryKeys";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { useFriendsFilterStore } from "@/entities/friends/model/useFriendsFilterStore";
import type { MyFriendsStats } from "@/entities/friends/model/types";
import { topics } from "@/shared/constants/topics";

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

type NotificationChangedEvent = {
  type: "notification_changed";
  kind?: string;
  chatId?: string;
  notificationId?: string;
  unreadCount?: number;
};

type NotificationEvent = NotificationCreatedEvent | NotificationChangedEvent;

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
    (payload: NotificationEvent) => {
      if (typeof payload.unreadCount === "number") {
        queryClient.setQueryData(["notifications", "unread-count"], {
          unreadCount: payload.unreadCount,
        });
      }

      if (payload.type === "notification_changed") {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });

        // чаты/бейджи — как ты и хотел: пусть клиент сам перезапросит
        // ПОДСТАВЬ свои реальные queryKeys для списков чатов и unread-summary:
        queryClient.invalidateQueries({ queryKey: ["chats"] });
        queryClient.invalidateQueries({
          queryKey: ["chats", "unread-summary"],
        });

        // если у тебя есть отдельный запрос по chatId (опционально):
        if (payload.chatId) {
          queryClient.invalidateQueries({
            queryKey: ["chats", "by-id", payload.chatId],
          });
        }

        return;
      }

      // 2) Старый формат: "notification_created" — твоя текущая логика (friends toast)
      const notif = payload.notification;

      if (notif.type === FRIEND_REQUEST_TYPE) {
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

        toast(notif.text, {
          action: { label: "Open", onClick: openReceivedRequests },
        });

        return;
      }

      if (notif.type === FRIEND_REQUEST_ACCEPTED_TYPE) {
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

        toast(notif.text, {
          action: { label: "Open", onClick: openAllFriends },
        });

        return;
      }

      toast(notif.text);
    },
    [queryClient, navigate, setFilter],
  );

  useMercure<NotificationEvent>({
    topic: userId ? topics.userNotifications(userId) : "",
    enable: !!userId,
    onMessage,
  });

  return null;
}

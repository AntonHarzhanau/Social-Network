import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { topics, useMercure } from "@/shared/hooks/useMercure";
import { sessionStore } from "@/entities/session/model/sessionStore";
import { toast } from "sonner";

type NotificationEvent =
  | {
      type: "notification_created";
      notification: {
        id: string;
        type: string;
        text: string;
        target: any;
        payload: any;
        createdAt: string;
        readAt: string | null;
      };
      unreadCount?: number;
    }
  | {
      type: "notification_updated";
      notification: {
        id: string;
        type: string;
        text: string;
        target: any;
        payload: any;
        createdAt: string;
        readAt: string | null;
      };
      unreadCount?: number;
    };

export function NotificationsMercureBridge() {
  const userId = sessionStore((s) => s.user?.id);
  const queryClient = useQueryClient();

  const onMessage = useCallback(
    (payload: NotificationEvent) => {
      if (payload.type === "notification_created") {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });

        if (typeof payload.unreadCount === "number") {
          queryClient.setQueryData(["notifications", "unread-count"], {
            unreadCount: payload.unreadCount,
          });
        } else {
          queryClient.invalidateQueries({
            queryKey: ["notifications", "unread-count"],
          });
        }
        console.log("New notification:", payload);
        toast(payload.notification.text);
      }

      if (payload.type === "notification_updated") {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });

        if (typeof payload.unreadCount === "number") {
          queryClient.setQueryData(["notifications", "unread-count"], {
            unreadCount: payload.unreadCount,
          });
        } else {
          queryClient.invalidateQueries({
            queryKey: ["notifications", "unread-count"],
          });
        }
      }
    },
    [queryClient],
  );

  useMercure<NotificationEvent>({
    topic: userId ? topics.userNotifications(userId) : "",
    enable: !!userId,
    onMessage,
  });

  return null;
}

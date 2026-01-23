export type NotificationDTO = {
  id: string;
  type: string;
  text: string;
  target: unknown;
  payload: unknown;
  createdAt: string;
  readAt: string | null;
};

export type NotificationEvent =
  | {
      type: "notification_created";
      notification: Notification;
      unreadCount?: number;
    }
  | {
      type: "notification_updated";
      notification: Notification;
      unreadCount?: number;
    };

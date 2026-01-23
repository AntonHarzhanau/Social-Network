import { apiClient } from "@/shared/api/apiClient";
import { type NotificationDTO } from "../model/types";
export type UnreadCountResponse = { unreadCount: number };

export async function fetchUnreadCount(): Promise<UnreadCountResponse> {
  const response = await apiClient.get<UnreadCountResponse>(
    "/notifications/unread-count",
  );
  return response.data;
}

export async function fetchNotifications(
  page = 1,
  limit = 10,
): Promise<NotificationDTO[]> {
  const response = await apiClient.get<NotificationDTO[]>("/notifications", {
    params: {
      page,
      limit,
    },
  });
  return response.data;
}

export async function markNotificationAsRead(
  notificationId: string,
): Promise<void> {
  await apiClient.post(`/notifications/${notificationId}/read`);
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await apiClient.post("/notifications/read-all");
}

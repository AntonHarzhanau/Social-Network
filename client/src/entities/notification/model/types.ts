export type NotificationType =
  | "friend_request_created"
  | "friend_request_accepted"
  | "chat_message"
  | (string & {});

export type SourceKind = "chat" | "user" | "group";

export type NotificationSource = {
  kind: SourceKind;
  id: string;
  name: string;
  avatarUrl?: string | null;
  slug?: string | null;
};

export type NotificationGroup = { key: string; count: number };

export type NotificationDTO = {
  id: string;
  type: NotificationType;
  text: string;
  source: NotificationSource | null;
  payload: any;
  group?: NotificationGroup | null;
  createdAt: string;
  lastEventAt?: string | null;
};

export type NotificationEvent = {
  type: "notification_event";
  action: "created" | "updated" | "deleted" | "cleared";
  notification: NotificationDTO | { id: string } | null;
  unreadCount: number;
};

export type FriendRequestPayload = {
  source?: NotificationSource;
  friendshipId: string;
  requesterId: string;
  addresseeId: string;
};

export type ChatMessagePayload = {
  source?: NotificationSource;
  chatId: string;
  messageId?: string;
  senderId?: string;
};

export type FriendRequestCreatedNotification = Omit<
  NotificationDTO,
  "type" | "payload" | "source"
> & {
  type: "friend_request_created";
  payload: FriendRequestPayload;
  source: NotificationSource | null;
};

export type FriendRequestAcceptedNotification = Omit<
  NotificationDTO,
  "type" | "payload" | "source"
> & {
  type: "friend_request_accepted";
  payload: FriendRequestPayload;
  source: NotificationSource | null;
};

export type ChatMessageNotification = Omit<
  NotificationDTO,
  "type" | "payload" | "source"
> & {
  type: "chat_message";
  payload: ChatMessagePayload;
  source: NotificationSource | null;
};

export type UnknownNotification = NotificationDTO;

export type AppNotification =
  | FriendRequestCreatedNotification
  | FriendRequestAcceptedNotification
  | ChatMessageNotification
  | UnknownNotification;

export function normalizeNotification(dto: NotificationDTO): AppNotification {
  const source = (dto.source ??
    dto.payload?.source ??
    null) as NotificationSource | null;

  const payload = { ...(dto.payload ?? {}), ...(source ? { source } : {}) };

  switch (dto.type) {
    case "friend_request_created":
      return { ...dto, source, payload } as FriendRequestCreatedNotification;
    case "friend_request_accepted":
      return { ...dto, source, payload } as FriendRequestAcceptedNotification;
    case "chat_message":
      return { ...dto, source, payload } as ChatMessageNotification;
    default:
      return { ...dto, source, payload } as UnknownNotification;
  }
}

export function getChatId(n: AppNotification): string | null {
  if (n.type !== "chat_message") return null;
  return (
    n.payload?.chatId ??
    (n.source?.kind === "chat" ? n.source.id : null) ??
    null
  );
}

import type { AppNotification } from "../../model/types";
import type { NotificationHandler } from "./types";
import { friendRequestCreatedHandler } from "./friendRequestCreated";
import { friendRequestAcceptedHandler } from "./friendRequestAccepted";
import { chatMessageHandler } from "./chatMessage";
import { unknownHandler } from "./unknown";

const map: Record<string, NotificationHandler<any>> = {
  friend_request_created: friendRequestCreatedHandler,
  friend_request_accepted: friendRequestAcceptedHandler,
  chat_message: chatMessageHandler,
};

export function getHandler(type: string): NotificationHandler<AppNotification> {
  return (map[type] as NotificationHandler<AppNotification>) ?? unknownHandler;
}

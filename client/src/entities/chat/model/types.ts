import type { UserPreview } from "@/entities/user/model/types";

export interface Message {
  id: string;
  content: string;
  sender: UserPreview;
  createdAt: string;
}

export interface Chat {
  id: string;
  type: "self" | "direct" | "group";
  title?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: Message;
  lastMessageAt?: string;
  lastReadAt?: string | null;
  lastReadMessageId?: string | null;
  unreadMessageCount: number;
  lastReadMessageByOther?: string | null;
  lastReadAtByOther?: string | null;
}

export interface CreateDirectChatParams {
  participantId: string;
  content?: string;
}

export type ChatMercureEvent =
  | { type: "message_created"; message: Message }
  | { type: "message_updated"; messageId: string; message: Message }
  | { type: "message_deleted"; messageId: string }
  | {
      type: "chat_read";
      userId: string;
      lastReadAt: string;
      lastReadMessageId: string | null;
    };

export type ChatFilter = "all" | "unread";

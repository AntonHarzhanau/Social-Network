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
}

export interface CreateDirectChatParams {
  participantId: string;
  content?: string;
}

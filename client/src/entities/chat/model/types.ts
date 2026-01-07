import type { Me } from "@/features/auth/api/authApi";

export interface Message {
  id: string;
  content: string;
  sender: Me;
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
  unreadMessageCount: number | null;
}

export interface CreateDirectChatParams {
  participantId: string;
  content?: string;
}


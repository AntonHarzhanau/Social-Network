import type { InfiniteData } from "@tanstack/react-query";
import type { MessageResponse } from "../api/chat";

export type MessagesInfinite = InfiniteData<MessageResponse[]>;

export function removeMessageFromInfinite(
  oldMessages: MessagesInfinite | undefined,
  messageId: string,
): MessagesInfinite | undefined {
  if (!oldMessages) return oldMessages;

  return {
    ...oldMessages,
    pages: oldMessages.pages.map((page) =>
      page.filter((msg) => msg.id !== messageId),
    ),
  };
}

export function addMessageToInfinite(
  oldestMessages: MessagesInfinite | undefined,
  newMessage: MessageResponse,
): MessagesInfinite | undefined {
  if (!oldestMessages) {
    return { pages: [[newMessage]], pageParams: [undefined] };
  }

  const exists = oldestMessages.pages.some((page) =>
    page.some((msg) => msg.id === newMessage.id),
  );
  if (exists) {
    return oldestMessages;
  }

  const firstPage = oldestMessages.pages[0] ?? [];
  const newFirstPage = [newMessage, ...firstPage];

  return {
    ...oldestMessages,
    pages: [newFirstPage, ...oldestMessages.pages.slice(1)],
  };
}

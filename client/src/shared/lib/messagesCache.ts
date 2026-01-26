import type { InfiniteData } from "@tanstack/react-query";
import type { Message } from "@/entities/chat/model/types";

export type MessagesInfinite = InfiniteData<Message[], string | null>;

/**
 * Добавляет сообщение в кэш infinite-страниц.
 * Мы добавляем в "самую новую" страницу (pages[0]) в конец (порядок старые -> новые).
 */
export function addMessageToInfinite(
  oldData: MessagesInfinite | undefined,
  message: Message,
): MessagesInfinite {
  if (!oldData) {
    return {
      pages: [[message]],
      pageParams: [null],
    };
  }

  // дедуп по всем страницам
  for (const page of oldData.pages) {
    if (page.some((m) => m.id === message.id)) return oldData;
  }

  const pages = [...oldData.pages];
  const pageParams = [...oldData.pageParams];

  if (pages.length === 0) {
    return {
      pages: [[message]],
      pageParams: [null],
    };
  }

  const firstPage = pages[0] ?? [];
  pages[0] = [...firstPage, message];

  return { ...oldData, pages, pageParams };
}

/**
 * Удаляет сообщение из всех страниц.
 */
export function removeMessageFromInfinite(
  oldData: MessagesInfinite | undefined,
  messageId: string,
): MessagesInfinite | undefined {
  if (!oldData) return oldData;

  const pages: Message[][] = [];
  const pageParams: (string | null)[] = [];

  for (let i = 0; i < oldData.pages.length; i++) {
    const page = oldData.pages[i] ?? [];
    const filtered = page.filter((m) => m.id !== messageId);

    if (filtered.length > 0) {
      pages.push(filtered);
      pageParams.push(oldData.pageParams[i] ?? null);
    }
  }

  if (pages.length === 0) return undefined;

  return { ...oldData, pages, pageParams };
}

/**
 * Вставляет tail-страницу (последние сообщения) в начало pages.
 * Используем, когда открыли чат "around(cursor)", но хотим иметь и самый низ (tail).
 */
export function prependTailPage(
  oldData: MessagesInfinite | undefined,
  tailPage: Message[],
): MessagesInfinite {
  if (!oldData) {
    return {
      pages: [tailPage],
      pageParams: [null],
    };
  }

  return {
    ...oldData,
    pages: [tailPage, ...oldData.pages],
    pageParams: [null, ...oldData.pageParams],
  };
}

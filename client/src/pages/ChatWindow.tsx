import React, { useEffect, useState } from "react";

type ChatMessage = {
  id: string;
  senderId: string;
  senderName?: string;
  content: string;
  createdAt: string;
};

type ChatWindowProps = {
  chatId: string;        // id чата (uuid)
  currentUserId: string; // id текущего пользователя
};

const MERCURE_PUBLIC_URL = "http://localhost/.well-known/mercure"; // из .env можешь взять

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chatId,
  currentUserId,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // 1. (опционально) можно загрузить старые сообщения REST-запросом
  useEffect(() => {
    async function fetchInitialMessages() {
      try {
        const res = await fetch(`/api/chats/${chatId}/messages`);
        if (!res.ok) {
          throw new Error("Failed to load messages");
        }
        const data = (await res.json()) as ChatMessage[];
        setMessages(data);
      } catch (e) {
        console.error(e);
      }
    }

    fetchInitialMessages();
  }, [chatId]);

  // 2. Подписка на Mercure
  useEffect(() => {
    // Формируем URL для подписки
    const url = new URL(MERCURE_PUBLIC_URL);
    const topic = `https://qynso.local/chats/${chatId}`;
    url.searchParams.append("topic", topic);

    // Создаём EventSource
    const eventSource = new EventSource(url.toString());

    eventSource.onopen = () => {
      console.log("Mercure connected");
      setConnectionError(null);
    };

    eventSource.onerror = (event) => {
      console.error("Mercure error:", event);
      setConnectionError("Проблема с подключением к Mercure");
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Ожидаем формат:
        // { type: "message_created", chatId: "...", message: {...} }
        if (data.type === "message_created" && data.message) {
          const newMessage: ChatMessage = {
            id: data.message.id,
            senderId: data.message.senderId,
            senderName: data.message.senderName,
            content: data.message.content,
            createdAt: data.message.createdAt,
          };

          // Добавляем новое сообщение в конец списка
          setMessages((prev) => [...prev, newMessage]);
        }
      } catch (e) {
        console.error("Error parsing Mercure event", e);
      }
    };

    // Чистка при смене чата / размонтировании компонента
    return () => {
      eventSource.close();
      console.log("Mercure disconnected");
    };
  }, [chatId]);

  return (
    <div className="flex flex-col h-full border rounded-md">
      {/* Заголовок чата */}
      <div className="p-3 border-b font-semibold">
        Chat: {chatId}
        {connectionError && (
          <div className="text-red-500 text-sm mt-1">{connectionError}</div>
        )}
      </div>

      {/* Список сообщений */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {messages.length === 0 && (
          <div className="text-sm text-muted-foreground">
            Сообщений пока нет
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;

          return (
            <div
              key={msg.id}
              className={`flex ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                  isMe
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {!isMe && (
                  <div className="text-xs font-semibold mb-1 opacity-80">
                    {msg.senderName ?? msg.senderId.slice(0, 8)}
                  </div>
                )}
                <div>{msg.content}</div>
                <div className="mt-1 text-[10px] opacity-70 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Простейший input для отправки (пока без Mercure, просто POST) */}
      <ChatInput chatId={chatId} />
    </div>
  );
};

// Простейший input для отправки сообщений — в том же файле
const ChatInput: React.FC<{ chatId: string }> = ({ chatId }) => {
  const [value, setValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setIsSending(true);
    try {
      const res = await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // сюда же можно добавить Authorization, если у тебя JWT
        },
        body: JSON.stringify({ content: trimmed }),
      });

      if (!res.ok) {
        console.error("Failed to send message");
      } else {
        setValue("");
        // новое сообщение придёт через Mercure, вручную в state не добавляем
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex gap-2 p-3 border-t">
      <input
        className="flex-1 border rounded px-2 py-1 text-sm bg-background"
        placeholder="Напишите сообщение..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <button
        className="px-3 py-1 rounded bg-blue-600 text-white text-sm disabled:opacity-60"
        onClick={handleSend}
        disabled={isSending || !value.trim()}
      >
        Send
      </button>
    </div>
  );
};

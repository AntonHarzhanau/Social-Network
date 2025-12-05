import { fetchMessages, type MessageResponse } from "@/shared/api/Chat";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/shared/store/authStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ChatPage = () => {
  const params = useParams<{ chatId: string }>();
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const currentUserId = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    const loadMessages = async () => {
      if (params.chatId) {
        console.log("Fetching messages for chatId:", params.chatId);
        const data = await fetchMessages(params.chatId);
        setMessages(data);
        console.log("Fetched messages:", data);
      }
    };

    loadMessages();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {messages.map((message) => (
        <div key={message.id}>
          <div className={cn("flex gap-4 border", message.sender.id === currentUserId ? "justify-end" : "justify-start")}>
            <UserAvatar imageUrl={message.sender.avatarUrl} name={message.sender.username} className="w-10 h-10" />
            <div className="flex flex-col">
              <h2>{message.sender.username}</h2>
              <p>{message.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatPage;
export const Component = ChatPage;

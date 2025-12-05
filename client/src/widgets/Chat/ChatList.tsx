import { fetchChats, type ChatResponse } from "@/shared/api/Chat";
import { useEffect, useState } from "react";
import ChatListItem from "./ChatListItem";

const ChatList = () => {
  const [chats, setChats] = useState<ChatResponse[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchChats();
      setChats(data);
    };
    loadUsers();
  }, []);
  return (
    <div className="flex flex-col">
      {chats.map((chat) => (
        <ChatListItem key={chat.id} chat={chat} />
      ))}
    </div>
  );
};

export default ChatList;

import type { ChatResponse } from "@/shared/api/chat";
import { Item, ItemMedia } from "@/shared/components/ui/item";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { useChatStore } from "@/shared/store/chatStore";
import { useNavigate } from "react-router-dom";

interface ChatListItemProps {
    chat: ChatResponse;
}

const ChatListItem = ({ chat }: ChatListItemProps) => {
    
    const addChat = useChatStore((s) => s.addChat);
    const navigate = useNavigate();

    const handleClick = () => {
      addChat(chat)
      navigate(`/chats/${chat.id}`)
    }

  return (
    <Item variant="outline" key={chat.id} asChild>
      <div onClick={() => handleClick()} className="flex items-center gap-2">
        <ItemMedia variant="icon" className="w-10 h-10 rounded-full">
          <UserAvatar
            imageUrl={chat.avatarUrl}
            alt={chat.title}
            name={chat.title}
          />
        </ItemMedia>
        <div>
          <h2>{chat.title}</h2>
          <p>{chat.lastMessage?.content}</p>
        </div>
      </div>
    </Item>
  );
};

export default ChatListItem;

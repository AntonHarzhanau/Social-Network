import type { ChatResponse } from "@/shared/api/chat";
import DropDownButton from "@/shared/components/DropDownButton";
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
    <Item variant="default" key={chat.id} className="hover:bg-muted p-2" asChild>
      <div onClick={() => handleClick()} className="flex items-center gap-2 min-w-0">
        <ItemMedia variant="icon" className="w-10 h-10 rounded-full shrink-0">
          <UserAvatar
            imageUrl={chat.avatarUrl}
            alt={chat.title}
            name={chat.title}
          />
        </ItemMedia>
        <div className="min-w-0 flex-1">
         <div className="flex justify-between">
             <h2 className="truncate">{chat.title}</h2>
            <DropDownButton/>
         </div>
          <p className="text-sm text-muted-foreground truncate">{chat.lastMessage?.content}</p>
        </div>
      </div>
    </Item>
  );
};

export default ChatListItem;

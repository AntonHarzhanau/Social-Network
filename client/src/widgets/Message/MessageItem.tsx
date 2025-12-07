import type { MessageResponse } from "@/shared/api/chat";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { cn } from "@/shared/lib/utils";

interface MessageItemProps {
  message: MessageResponse;
  currentUserId?: string;
}

const MessageItem = ({ message, currentUserId }: MessageItemProps) => {
  return (
    <div key={message.id} className="mb-2">
      <div
        className={cn(
          "flex items-center gap-2 mr-auto p-1",
          message.sender.id === currentUserId ? "bg-accent/40 rounded-2xl" : "mr-auto",
        )}
      >
        <UserAvatar
          imageUrl={message.sender.avatarUrl}
          name={message.sender.username}
          className="w-8 h-8"
        />
        <div className="flex flex-col rounded-lg bg-muted px-3 py-2">
          <h2 className="text-xs font-semibold">{message.sender.username}</h2>
          <p className="text-sm">{message.content}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;

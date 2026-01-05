import { type MessageResponse } from "@/shared/api/chat";
import { Button } from "@/shared/components/ui/button";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { useDeleteMessage } from "@/shared/hooks/useDeleteMessage";
import { cn } from "@/shared/lib/utils";

interface MessageItemProps {
  chatId: string;
  message: MessageResponse;
  currentUserId?: string;
}

const MessageItem = ({ chatId, message, currentUserId }: MessageItemProps) => {
  const del = useDeleteMessage();

  return (
    <div
      id={`msg-${message.id}`}
      data-message-id={message.id}
      className="mb-2"
    >
      <div
        className={cn(
          "flex items-center gap-2 mr-auto p-1",
          message.sender.id === currentUserId
            ? "bg-accent/40 rounded-2xl"
            : "mr-auto",
        )}
      >
        <UserAvatar
          imageUrl={message.sender.avatarUrl}
          name={message.sender.username}
          className="w-8 h-8 min-w-8"
        />
        <div className="flex flex-col rounded-lg bg-muted px-3 py-2">
          <h2 className="text-xs font-semibold">{message.sender.username}</h2>
          <p className="text-sm whitespace-pre-wrap wrap-break-words wrap-anywhere">
            {message.content}
          </p>
        </div>
        <Button
          onClick={() => del.mutate({ chatId, messageId: message.id })}
          variant="ghost"
          size="icon"
          className="opacity-50 hover:opacity-80 ml-auto"
          disabled={del.isPending}
        >
          &#x2715;
        </Button>
      </div>
    </div>
  );
};

export default MessageItem;

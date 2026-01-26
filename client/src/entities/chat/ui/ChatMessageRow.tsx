import * as React from "react";
import { cn } from "@/shared/lib/utils";
import type { Message } from "@/entities/chat/model/types";
import { Avatar } from "@/shared/components/Avatar";
import { CheckCheck } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/components/ui/dropdown-menu";
import { deleteMessage } from "../api/chat";

export function ChatMessageRow(props: {
  message: Message;
  isMine: boolean;
  isUnread: boolean;
  isReadByOther?: boolean;
  onEdit?: (messageId: string) => void;
}) {
  const { message, isMine, isUnread, isReadByOther, onEdit } = props;

  const onDelete = async (messageId: string) => {
    await deleteMessage(messageId);
  };

  const d = new Date(message.createdAt);
  const time = d.toISOString().slice(11, 16); // "15:48" (UTC)

  const [open, setOpen] = React.useState(false);

  const Row = (
    <div
      className={cn(
        "w-full px-2 py-1 mb-2",
        "flex gap-2 justify-start rounded-md",
        isMine && "cursor-pointer",
        isMine && open && "bg-muted ring-1 ring-border",
        isMine && !open && "hover:bg-muted/50",
      )}
    >
      <Avatar
        imageUrl={message.sender.avatarUrl}
        name={message.sender.name}
        isOnline={message.sender.isOnline}
        className="h-11 w-11"
      />

      <div className="flex flex-col min-w-0">
        <h3 className="text-sm font-bold whitespace-pre-wrap wrap-break-word">
          {message.sender.name}
        </h3>
        <p className="text-xs whitespace-pre-wrap wrap-break-word">
          {message.content}
        </p>
      </div>

      <div className="flex flex-col ml-auto">
        <div className="flex gap-1 items-center">
          {isMine ? (
            <CheckCheck
              size={16}
              strokeWidth={1}
              className={cn(isReadByOther ? "text-blue-500" : "text-gray-400")}
            />
          ) : null}

          {/* isUnread оставляю как есть — у тебя он используется для подсветки/логики,
              но на UI для чужих сообщений обычно лучше выделять фон, а не чек.
              Если хочешь — можно применить isUnread к фону строки. */}
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
      </div>
    </div>
  );

  if (!isMine || !message.id) return Row;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="w-full text-left focus-visible:outline-none"
          onClick={() => setOpen(true)}
        >
          {Row}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" side="bottom" className="w-40">
        <DropdownMenuItem onSelect={() => onEdit?.(message.id)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={() => onDelete(message.id)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

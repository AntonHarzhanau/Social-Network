import * as React from "react";
import { cn } from "@/shared/lib/utils";
import type { Message } from "@/entities/chat/model/types";
import { Avatar } from "@/shared/components/Avatar";
import { Check, CheckCheck } from "lucide-react";

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

  // unread относительно ТЕКУЩЕГО пользователя (т.е. "я не прочитал")
  isUnread: boolean;

  // NEW: показывать ли read-receipt (обычно: direct + isMine)
  showReadMark?: boolean;

  // NEW: прочитал ли собеседник моё сообщение
  isReadByOther?: boolean;

  onEdit?: (messageId: string) => void;
}) {
  const {
    message,
    isMine,
    isUnread,
    showReadMark = false,
    isReadByOther = false,
    onEdit,
  } = props;

  const onDelete = async (messageId: string) => {
    await deleteMessage(messageId);
  };

  const d = new Date(message.createdAt);
  const time = d.toISOString().slice(11, 16);

  const [open, setOpen] = React.useState(false);

  const Row = (
    <div
      className={cn(
        "w-full px-2 py-1 mb-2",
        "flex gap-2 justify-start rounded-md",

        // фон темнее для непрочитанных входящих
        !isMine && isUnread && "bg-muted ring-1 ring-border",

        // поведение для моих сообщений (контекстное меню)
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
          {showReadMark ? (
            isReadByOther ? (
              <CheckCheck size={16} strokeWidth={1} className="text-blue-500" />
            ) : (
              <Check size={16} strokeWidth={1} className="text-gray-400" />
            )
          ) : null}

          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
      </div>
    </div>
  );

  // меню — только для моих сообщений
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
